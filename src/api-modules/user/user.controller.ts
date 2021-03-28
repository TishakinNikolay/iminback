import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query} from '@nestjs/common';
import { CreateUserDto } from './models/dto/request/create-user.dto';
import { ResponseUserDto } from './models/dto/response/response-user.dto';
import { UserService } from './user.service';
import {UpdateUserDto} from './models/dto/request/update-user.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Post('/create')
    createUser(@Body() user: CreateUserDto): Promise<ResponseUserDto> {
        return this.userService.createUser(user);
    }

    @Get('/')
    getUserByPhone(@Query('phone') phone: string): Promise<ResponseUserDto> {
        return this.userService.getUserByPhone(phone);
    }

    @Put('/:id')
    updateUser(@Body() newUser: UpdateUserDto, @Param('id') id: number): Promise<ResponseUserDto> {
        return this.userService.updateUser(newUser, id);
    }

    @Get('/:id')
    getUserById(@Param('id') id: number): Promise<ResponseUserDto> {
        return this.userService.getUserById(id);
    }

    @Delete('/:id')
    @HttpCode(204)
    async deleteUserById(@Param('id') id: number): Promise<void> {
        await this.userService.deleteUser(id);
    }
}