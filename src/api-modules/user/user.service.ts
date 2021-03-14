import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { CreateUserDto } from "./models/create-user.dto";
import { ResponseUserDto } from "./models/response-user.dto";
import { scalable } from "../_shared/base/remap-decorator";
import { User } from "./models/user.entity";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
    ) {
    }
    public async createUser(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
        const user: User = Object.assign(new User(), createUserDto);
        return this.userRepository.createUser(user);
    }
    @scalable(ResponseUserDto)
    public async getUserById(id: number): Promise<ResponseUserDto> {
        return this.userRepository.getUserById(id);
    }
}