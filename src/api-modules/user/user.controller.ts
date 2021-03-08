import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./models/create-User.dto";
import { ResponseUserDto } from "./models/response-User.dto";

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Post('/create')
    createUser(@Body() user: CreateUserDto): Promise<ResponseUserDto> {
        return this.userService.createUser(user);
    }
}