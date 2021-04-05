import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {AuthModule} from './user-modules/auth/auth.module';
import {UserValidatorService} from './user-validator.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';


@Module({
    controllers: [UserController],
    providers: [
        UserService,
        UserValidatorService,
    ],
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([UserRepository])
    ],
    exports: [
        UserService,
        UserValidatorService,
        TypeOrmModule.forFeature([UserRepository])
    ]
})
export class UserModule { }