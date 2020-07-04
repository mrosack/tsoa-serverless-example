import {Route, Get, Post, Delete, Patch, Example, Body, Controller} from 'tsoa';
import {inject, provideSingleton} from '../ioc';
import {User, UserCreateRequest, UserUpdateRequest} from '../models/user';
import {UsersService} from '../services/usersService';

@Route('Users')
@provideSingleton(UsersController)
export class UsersController extends Controller {
    constructor(@inject(UsersService) private usersService: UsersService) {
      super();
    }

    /** Get the current user */
    @Get('Current')
    @Example<User>({
        createdAt: new Date(),
        email: 'test@test.com',
        id: 1,
    })
    public async Current(): Promise<User> {
        return await this.usersService.get(666);
    }

    /** Get user by ID */
    @Get('{userId}')
    public async Get(userId: number): Promise<User> {
        return await this.usersService.get(userId);
    }

    /**
     * Create a user
     * @param request This is a user creation request description
     */
    @Post()
    public async Create(@Body() request: UserCreateRequest): Promise<User> {
        return await this.usersService.create(request);
    }

    /** Delete a user by ID */
    @Delete('{userId}')
    public async Delete(userId: number): Promise<void> {
        return Promise.resolve();
    }

    /** Update a user */
    @Patch()
    public async Update(@Body() request: UserUpdateRequest): Promise<User> {
        return await this.usersService.update(request);
    }
}
