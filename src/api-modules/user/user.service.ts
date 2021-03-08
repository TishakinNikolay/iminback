import { Injectable } from "@nestjs/common";
import { UserRepository } from "./User.repository";
import { CreateUserDto } from "./models/create-User.dto";
import { ResponseUserDto } from "./models/response-User.dto";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
    ) {
    }
    public async createUser(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
        return this.userRepository.createUser(createUserDto);
    }
}