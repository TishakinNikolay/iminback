import {EntityRepository, FindConditions, FindOneOptions, Repository} from 'typeorm';
import {User} from './models/user.entity';
import {UpdateUserDto} from './models/dto/request/update-user.dto';
import {UserFindError} from './errors/user-find.error';
import {UserErrorEnum} from './enums/user-error.enum';
import {UserAlreadyExistsError} from "./errors/user-already-exists.error";

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

    async updateUser(newUser: UpdateUserDto, id: number): Promise<User> {
        const user = await this.findOne(id, {relations: ['profileImage', 'city', 'city.country']});

        if (!user) {
           throw new UserFindError([
               {
                   type: UserErrorEnum.NOT_FOUND,
                   details: 'Not found user by id: ' + id
               }
           ]);
        }

        if (await this.findOne(
            {where: [
                    {nickname: newUser.nickname}
                ]},
            )) {
            throw new UserAlreadyExistsError();
        }

        const updateUser = Object.assign(user, newUser);

        return updateUser.save();
    }
}