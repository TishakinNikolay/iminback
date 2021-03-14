import { EntityRepository, Repository } from "typeorm";
import { User } from "./models/user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User>{

    async createUser(user: User): Promise<User> {
        return this.save(user);
    }

    getAllUsers(): Promise<User[]> {
        return this.find();
    }
    async getUserById(id: number): Promise<User> {
        const r = await this.findOne(id, { relations: ['profileImage', 'city', 'city.country'] });
        return r;
    }
}