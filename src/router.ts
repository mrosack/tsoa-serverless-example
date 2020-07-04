import { Router } from 'express';
import { RegisterRoutes } from '../_gen/routes/routes';
import { ErrorResponse, HttpRequest, HttpResponse, HttpResponseError, LambdaProxyEvent, LambdaProxyCallback } from './framework';
import * as winston from 'winston';

winston.configure({
  exitOnError: false,
  handleExceptions: true,
  transports: [
    new winston.transports.Console()
  ]
});

const router = Router();

router.get('/swagger.json', (req, res) => {
  res.status(200).json(require('../_gen/swagger/swagger.json'));
});

type middlewareExec = ((request: HttpRequest, response: HttpResponse, next: any) => void);

function methodHandler(method: string) {
  return function (route: string, ...routeExecs: middlewareExec[]) {
    router[method](route, (req, res) => {
      winston.info(`Found route ${route}`);

      const runNext = (runExecs: middlewareExec[]) => {
        const curExec: middlewareExec = runExecs[0];

        curExec(req, res, (err) => {
          if (err) {
            if (err instanceof HttpResponseError) {
              res.status(err.statusCode).json(new ErrorResponse(err.message));
              return;
            }

            winston.error(`Unhandled Exception: ${JSON.stringify(err.stack || err)}`);


            res.status(500).json(new ErrorResponse('There was an error procesing your request.'));
          } else if (runExecs.length > 1) {
            runNext(runExecs.slice(1));
          }
        });
      };

      runNext(routeExecs);
    });
  };
}

const mockApp = {
  delete: methodHandler('delete'),
  get: methodHandler('get'),
  patch: methodHandler('patch'),
  post: methodHandler('post'),
  put: methodHandler('put')
};

RegisterRoutes(mockApp as any);

export function handler(event: LambdaProxyEvent, context, callback: LambdaProxyCallback) {
  winston.info(`handling ${event.httpMethod} ${event.path}`);

  const response = new HttpResponse(callback);

  if (event.httpMethod.toLowerCase() === 'options') {
    response.status(200).end();
  } else {
    (router as any).handle(new HttpRequest(event), response, err => {
      winston.info(`404 for ${event.httpMethod} ${event.path}`);
      response.status(404).json(new ErrorResponse('Not Found'));
    });
  }
}
