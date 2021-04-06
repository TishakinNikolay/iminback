import {Controller, Get, Request, UseGuards} from '@nestjs/common';
import {LocalGuard} from '../user/user-modules/auth/guards/local.guard';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
    ) {
    }

    @Get()
    @UseGuards(LocalGuard)
    public async getCategories(@Request() req) {
        const user = req.user;
        console.log(this.categoryService);
        return this.categoryService.getCategoriesByGender(user.gender.valueOf());
    }
}