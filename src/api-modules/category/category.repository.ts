import {EntityRepository, Repository} from 'typeorm';
import {Category} from './category.entity';
import {GenderCategoryEnum} from './enums/gender.enum';
import {Image} from "../image/models/image.entity";

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
    public async getCategories(gender: GenderCategoryEnum = GenderCategoryEnum.ALL): Promise<Category[]> {
        return await this.find({
            where: [
                {gender},
                {gender: GenderCategoryEnum.ALL}
            ],
            relations:['images', 'icon']
        });
    }

    public async getCategoriesByValues(values: string[]): Promise<Category[]> {
        return this
            .createQueryBuilder('category')
            .where('value IN (:...values)')
            .setParameter('values', values)
            .getMany();
    }

    public async getAllCategories(): Promise<Category[]>{
        return this.find({relations:['images', 'icon']});
    }

    public async search(page, pageSize, name, limitImages) {
        const resultQuery = this.
        createQueryBuilder('category')
            .leftJoinAndSelect(`category.images`, 'images')
            .leftJoinAndSelect('category.icon', 'icon')
            .where('category.name LIKE :name').setParameter('name', `%${name}%`)
            .skip(page * pageSize)
            .take(pageSize)

        const result = await resultQuery.getMany()

        for(const cat of result) {
            cat.images = cat.images.slice(0, -(cat.images.length-limitImages))
        }

        return result

    }
}
