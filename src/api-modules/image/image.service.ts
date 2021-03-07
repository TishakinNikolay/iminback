import { Injectable } from "@nestjs/common";
import { ImageLoaderService } from "./image-modules/image-loader/image-loader.service";
import { ImageRepository } from "./image.repository";
import { CreateImageDto } from "./models/create-image.dto";
import { ResponseImageDto } from "./models/response-image.dto";

@Injectable()
export class ImageService {
    constructor(
        private readonly imageRepository: ImageRepository,
        private imageLoaderService: ImageLoaderService
    ) {
    }
    public async createImage(createImageDto: CreateImageDto): Promise<ResponseImageDto> {
        const publicLink = await this.imageLoaderService.loadImage(createImageDto);
        return this.imageRepository.createImage(publicLink);
    }
}