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
}