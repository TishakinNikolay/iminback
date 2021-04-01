import {forwardRef, Module} from '@nestjs/common';
import {ImageModule} from '../../../image/image.module';
import {UserModule} from '../../user.module';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {JwtService} from './jwt.service';
import {LocalStrategy} from './strategies/local.strategy';

@Module({
    controllers: [AuthController],
    providers: [AuthService, JwtService, LocalStrategy],
    imports: [forwardRef(() => UserModule), forwardRef(() => ImageModule)]
})
export class AuthModule {}