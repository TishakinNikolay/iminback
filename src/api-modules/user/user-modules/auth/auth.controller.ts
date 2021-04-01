import {Body, Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {AuthService} from './auth.service';
import {RequestRegisterDto} from './models/dto/request/request-register.dto';
import {FileInterceptor} from '@nestjs/platform-express';
import {CreateImageDto} from '../../../image/models/create-image.dto';
import {RequestLoginDto} from './models/dto/request/request-login.dto';
import {Tokens} from './models/token.models';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {
    }

    @Post('login')
    public async login(@Body() creds: RequestLoginDto): Promise<Tokens> {
        return this.authService.login(creds);
    }

    @Post('register')
    @UseInterceptors(FileInterceptor('photo'))
    public async register(@Body() user: RequestRegisterDto, @UploadedFile() image: CreateImageDto): Promise<{ code: number }> {
        user.image = image;
        const code = await this.authService.register(user, image);

        return {code};
    }
}