import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './models/create-user.dto';
import { ResponseUserDto } from './models/response-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Post('/create')
    createUser(@Body() user: CreateUserDto): Promise<ResponseUserDto> {
        console.log(user);
        return this.userService.createUser(user);
    }
    @Get('/:id')
    getUserById(@Param('id') id: number): Promise<ResponseUserDto> {
        return this.userService.getUserById(id);
    }
}