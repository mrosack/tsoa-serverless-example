import { Container, inject, decorate, injectable } from 'inversify';
import { autoProvide, fluentProvide } from 'inversify-binding-decorators';
import { Controller } from 'tsoa';
import { Identifier } from 'typescript';

const iocContainer = new Container();

decorate(injectable(), Controller);

const provideSingleton = (identifier: any) => {
    iocContainer.bind<Controller>(identifier).toSelf();
    return fluentProvide(identifier)
        .inSingletonScope()
        .done();
};

export { iocContainer, autoProvide, provideSingleton, inject };
