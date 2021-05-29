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

    @Get('search/:name')
    @UseGuards(LocalGuard)
    public async search(@Param('name') name: string, @Query() query) {
        const page = query.page ? query.page : 0;
        const pageSize = query.pageSize ? query.pageSize : 10;

        return this.categoryService.search(page,pageSize,name)
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
