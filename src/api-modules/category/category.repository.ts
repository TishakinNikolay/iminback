import { EntityRepository, Repository } from 'typeorm';
import { Category } from './category.entity';
import { GenderCategoryEnum } from './enums/gender.enum';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
    public async getCategories(gender: GenderCategoryEnum = GenderCategoryEnum.ALL): Promise<Category[]> {
        return await this.find({
            where: [
                { gender },
                { gender: GenderCategoryEnum.ALL }
            ]
        });
    }
}