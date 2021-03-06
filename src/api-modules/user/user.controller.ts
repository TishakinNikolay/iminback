import {Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query, UseGuards} from '@nestjs/common';
import {CreateUserDto} from './models/dto/request/create-user.dto';
import {UpdateUserDto} from './models/dto/request/update-user.dto';
import {ResponseUserDto} from './models/dto/response/response-user.dto';
import {LocalGuard} from './user-modules/auth/guards/local.guard';
import {UserService} from './user.service';
import {SetPushTokenDto} from "./models/dto/request/set-push-token.dto";
import {GetUser} from "../_shared/decorators/get-user-request.decorator";

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {
    }

    @Post('/create')
    createUser(@Body() user: CreateUserDto): Promise<ResponseUserDto> {
        return this.userService.createUser(user);
    }

    @Get('/')
    getUserByPhone(@Query('phone') phone: string): Promise<ResponseUserDto> {
        return this.userService.getUserByPhone(phone);
    }

    @Put('/:id')
    @UseGuards(LocalGuard)
    updateUser(@Body() newUser: UpdateUserDto, @Param('id') id: number): Promise<ResponseUserDto> {
        return this.userService.updateUser(newUser, id);
    }

    @Get('/:id')
    getUserById(@Param('id') id: number): Promise<ResponseUserDto> {
        return this.userService.getUserById(id);
    }

    @Delete('/:id')
    @UseGuards(LocalGuard)
    @HttpCode(204)
    async deleteUserById(@Param('id') id: number): Promise<void> {
        await this.userService.deleteUser(id);
    }

    @Patch('set-push-token')
    @UseGuards(LocalGuard)
    async setPushToken(@Body() token: SetPushTokenDto, @GetUser() user) {
        await this.userService.setPushToken(user, token.pushToken)
    }
}
