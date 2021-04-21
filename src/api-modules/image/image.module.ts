import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CategoryModule} from '../category/category.module';
import {CategoryService} from '../category/category.service';
import {UserModule} from '../user/user.module';
import {ImageLoaderModule} from './image-modules/image-loader/image-loader.module';
import {ImageController} from './image.controller';
import {ImageRepository} from './image.repository';
import {ImageService} from './image.service';


@Module({
    controllers: [ImageController],
    providers: [
        ImageService,
    ],
    imports: [
        TypeOrmModule.forFeature([ImageRepository]),
        ImageLoaderModule,
        forwardRef(() => CategoryModule)
    ],
    exports: [
        ImageService
    ]
})
export class ImageModule {
}