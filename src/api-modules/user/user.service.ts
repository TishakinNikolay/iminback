import { Injectable } from '@nestjs/common';
import { scalable } from '../_shared/decorators/remap.decorator';
import { CreateUserDto } from './models/dto/request/create-user.dto';
import { ResponseUserDto } from './models/dto/response/response-user.dto';
import { User } from './models/user.entity';
import { UserRepository } from './user.repository';
import {UpdateUserDto} from './models/dto/request/update-user.dto';

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

    @scalable(ResponseUserDto)
    public async getUserByPhone(phone: string): Promise<ResponseUserDto> {
        return this.userRepository.findOneByWhere({phone});
    }

    public async deleteUser(id: number): Promise<void> {
        await this.userRepository.softDelete(id);
    }

    @scalable(ResponseUserDto)
    public async updateUser(newUser: UpdateUserDto, id: number): Promise<ResponseUserDto> {
        return this.userRepository.updateUser(newUser, id);
    }
}