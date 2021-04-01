import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageLoaderModule } from './image-modules/image-loader/image-loader.module';
import { ImageController } from './image.controller';
import { ImageRepository } from './image.repository';
import { ImageService } from './image.service';


@Module({
    controllers: [ImageController],
    providers: [
        ImageService,
    ],
    imports: [
        TypeOrmModule.forFeature([ImageRepository]),
        ImageLoaderModule
    ],
    exports: [
        ImageService
    ]
})
export class ImageModule { }