import {Controller, Get, Headers, Post, Put, Query, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {LocalGuard} from '../user/user-modules/auth/guards/local.guard';
import {ImageService} from './image.service';
import {CreateImageDto} from './models/create-image.dto';
import {ResponseImageDto} from './models/response-image.dto';

@Controller('image')
export class ImageController {
    constructor(private imageService: ImageService) {
    }

    @Post('/upload')
    @UseInterceptors(FileInterceptor('photo'))
    createImage(@UploadedFile() image: CreateImageDto): Promise<ResponseImageDto> {
        return this.imageService.createImage(image);
    }



    @Put('/sync-storage')
    syncImagesWithStorage(@Headers('Authorization') key){
        if(key !== `Bearer ${process.env.SERIVCE_KEY}`) {
            throw new UnauthorizedException();
        }
        return this.imageService.syncImageWithStorage();
    }

    @Put('/loadFromLocal')
    loadFromLocal(@Headers('Authorization') key) {
        if(key !== `Bearer ${process.env.SERIVCE_KEY}`) {
            throw new UnauthorizedException();
        }
        return this.imageService.loadFromLocal();
    }
}