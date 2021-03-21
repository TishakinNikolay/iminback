import {Controller, Get} from '@nestjs/common';
import {User} from '../user/models/user.entity';
import {CategoryService} from './category.service';

@Controller('category')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
    ) {
    }

    @Get()
    public async getCategories() {
        const user = await User.findOne();

        return this.categoryService.getCategoriesByGender(user.gender.valueOf());
    }
}