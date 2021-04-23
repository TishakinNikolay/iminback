import {Injectable} from '@nestjs/common';
import {Category} from './category.entity';
import {CategoryRepository} from './category.repository';
import {GenderCategoryEnum} from './enums/gender.enum';

@Injectable()
export class CategoryService {
    constructor(
        private readonly categoryRepository: CategoryRepository,
    ) {
    }

    public async getCategoriesByGender(gender: GenderCategoryEnum): Promise<Category[]> {
        return await this.categoryRepository.getCategories(gender);
    }

    public async getCategoriesByValue(values: string[]):Promise<Category[]> {
        return await this.categoryRepository.getCategoriesByValues(values);
    }

    public async getCategoryPalette(windowSize: number): Promise<Category[]>{
        const categories = await this.categoryRepository.getAllCategories();
        categories.forEach( category => {
            category.images.splice(windowSize)
        });
        return categories;
    }
    public async getCategoryById(id: number): Promise<Category> {
        return Category.findOne(id, {relations:['images']})
    }
}