import { Injectable } from '@nestjs/common';
import { scalable } from '../_shared/decorators/remap.decorator';
import { CreateUserDto } from './models/dto/request/create-user.dto';
import { ResponseUserDto } from './models/dto/response/response-user.dto';
import { User } from './models/user.entity';
import {UserValidatorService} from './user-validator.service';
import { UserRepository } from './user.repository';
import {UpdateUserDto} from './models/dto/request/update-user.dto';
import {getConnection} from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly userValidatorService: UserValidatorService,
    ) {
        this.userRepository = getConnection().getCustomRepository(UserRepository);
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
        await this.userValidatorService.validateUserById(id);
        await this.userValidatorService.validateSameUserByPhoneAndNickname(newUser.phone, newUser.nickname);
        newUser.id = id;
        return this.userRepository.updateUser(newUser);
    }
}