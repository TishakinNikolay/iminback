import {Injectable} from '@nestjs/common';
import {getConnection} from 'typeorm';
import {scalable} from '../_shared/decorators/remap.decorator';
import {UserAlreadyExistsError} from './errors/user-already-exists.error';
import {CreateUserDto} from './models/dto/request/create-user.dto';
import {UpdateUserDto} from './models/dto/request/update-user.dto';
import {ResponseUserDto} from './models/dto/response/response-user.dto';
import {User} from './models/user.entity';
import {UserValidatorService} from './user-validator.service';
import {UserRepository} from './user.repository';

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
        await this.userRepository.delete({id:id});
    }

    @scalable(ResponseUserDto)
    public async updateUser(newUser: UpdateUserDto, id: number): Promise<ResponseUserDto> {
        await this.userValidatorService.validateUserById(id);
        const oldUser = await this.getUserById(id);
        if (newUser.phone != oldUser.phone || newUser.nickname != oldUser.nickname) {
            throw new UserAlreadyExistsError(null);
        }
        newUser.id = id;
        return this.userRepository.updateUser(newUser);
    }

    public async setPushToken(user: User, token: string) {
        user.pushNotificationToken = token
        await user.save()
    }
}
