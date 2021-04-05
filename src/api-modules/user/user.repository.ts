import {EntityRepository, FindConditions, FindOneOptions, Repository} from 'typeorm';
import {User} from './models/user.entity';
import {UpdateUserDto} from './models/dto/request/update-user.dto';
import {UserFindError} from './errors/user-find.error';
import {UserErrorEnum} from './enums/user-error.enum';
import {UserValidatorService} from './user-validator.service';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async createUser(user: User): Promise<User> {
        return this.save(user);
    }

    getAllUsers(): Promise<User[]> {
        return this.find();
    }

    async getUserById(id: number): Promise<User> {
        return await this.findOne(id, {relations: ['profileImage', 'city', 'city.country']});
    }

    async findOneByWhere(conditions: FindConditions<User>): Promise<User> {
        return await this.findOne(conditions, {relations: ['profileImage', 'city', 'city.country']});
    }

    async updateUser(newUser: UpdateUserDto): Promise<User> {
        const updateUser = Object.assign(new User(), newUser);
        return updateUser.save();
    }
}