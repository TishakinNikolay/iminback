import { Controller, Post, UseInterceptors, UploadedFile, UploadedFiles } from "@nestjs/common";
import { ImageService } from "./image.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateImageDto } from "./models/create-image.dto";
import { ResponseImageDto } from "./models/response-image.dto";

@Controller('image')
export class ImageController {
    constructor(private imageService: ImageService) { }

    @Post('/upload')
    @UseInterceptors(FileInterceptor("photo"))
    createImage(@UploadedFile() image: CreateImageDto): Promise<ResponseImageDto> {
        return this.imageService.createImage(image);
    }
}