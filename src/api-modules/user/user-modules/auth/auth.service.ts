import {ConflictException, forwardRef, Inject, Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {ImageService} from '../../../image/image.service';
import {CreateImageDto} from '../../../image/models/create-image.dto';
import {UserErrorEnum} from '../../enums/user-error.enum';
import {UserAlreadyExistsError} from '../../errors/user-already-exists.error';
import {UserFindError} from '../../errors/user-find.error';
import {User} from '../../models/user.entity';
import {AuthNotValidCodeError} from './errors/auth-not-valid-code.error';
import {JwtService} from './jwt.service';
import {RequestLoginDto} from './models/dto/request/request-login.dto';
import {RequestRegisterDto} from './models/dto/request/request-register.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(forwardRef(() => ImageService))
        private readonly imageService: ImageService,
    ) {}

    public async login(creds: RequestLoginDto) {
        console.log(creds);
        const user = await User.findOne({phone: creds.phone});

        if (!user) {
            throw new UserFindError([
                {
                    type: UserErrorEnum.NOT_FOUND,
                    details: 'Not found user by phone: ' + creds.phone
                }
            ]);
        }

        if (await user.validatePassword(creds.code)) {
            user.code = null;
            await user.save();
            return this.jwtService.tokensByUser(user);
        } else {
            throw new AuthNotValidCodeError();
        }
    }

    public async register(registerDto: RequestRegisterDto, image?: CreateImageDto) {
        let user = await User.findOne({
            where: [
                {
                    phone: registerDto.phone
                },
                {
                    nickname: registerDto.nickname
                }
            ]
        });

        if (user) {
            throw new UserAlreadyExistsError();
        }

        user = Object.assign(new User(), registerDto);

        if (image) {
            user.profileImage = await this.imageService.createImage(image);
        }

        const code = this.generateCode();

        user.code = await this.hashPhoneCode(code);
        await user.save();

        return code;
    }

    private async hashPhoneCode(code: number): Promise<string> {
        console.log(process.env['HASH_SALT_PHONE_CODE ']);
        return bcrypt.hash(code.toString(), process.env.HASH_SALT_PHONE_CODE);
    }

    private generateCode(): number {
        let min = 1000, max = 9999;
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
}