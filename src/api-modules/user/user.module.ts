import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./User.controller";
import { UserRepository } from "./User.repository";
import { UserService } from "./User.service";


@Module({
    controllers: [UserController],
    providers: [
        UserService,
    ],
    imports: [
        TypeOrmModule.forFeature([UserRepository]),
    ]
})
export class UserModule { }