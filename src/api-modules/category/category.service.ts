import {Injectable} from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { GenderCategoryEnum } from './enums/gender.enum';
import { Category } from './category.entity';
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