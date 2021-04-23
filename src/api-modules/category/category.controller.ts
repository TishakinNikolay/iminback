import {Controller, Get, Param, Query, Request, UseGuards} from '@nestjs/common';
import {LocalGuard} from '../user/user-modules/auth/guards/local.guard';
import {Category} from './category.entity';
import {CategoryService} from './category.service';

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
        return this.categoryService.getCategoriesByGender(user.gender.valueOf());
    }
    @Get('/palette')
    @UseGuards(LocalGuard)
    public async getImagesPalette(@Query('windowSize') windowSize:number): Promise<Category[]> {
        return this.categoryService.getCategoryPalette(windowSize);
    }

    @Get('/id/:id')
    @UseGuards(LocalGuard)
    public async getCategoryById(@Param('id') id: number) {
        return this.categoryService.getCategoryById(id);
    }

}