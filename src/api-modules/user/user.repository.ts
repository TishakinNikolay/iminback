import { EntityRepository, Repository } from "typeorm";
import { CreateUserDto } from "./models/create-user.dto";
import { User } from "./models/user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User>{

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const user = Object.assign(new User(), createUserDto);
        return this.save(user);
    }

    getAllUsers(): Promise<User[]> {
        return this.find();
    }
}