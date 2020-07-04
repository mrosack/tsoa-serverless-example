import {Company} from '../models/company';
import {CompaniesService} from '../services/companiesService';
import {inject, provideSingleton} from '../ioc';
import {Route, Get, Controller} from 'tsoa';
import {User} from '../models/user';

@Route('Companies')
@provideSingleton(CompaniesController)
export class CompaniesController extends Controller {
    constructor(@inject(CompaniesService) private companiesService: CompaniesService) {
      super();
    }

    /** Get the current account */
    @Get('Current')
    public async current(): Promise<Company> {
        return await this.companiesService.get(600);
    }

    /** Get a list of users for the account */
    @Get('Users')
    public async getUsers(): Promise<User[]> {
        return await this.companiesService.getUsers(600);
    }
}
