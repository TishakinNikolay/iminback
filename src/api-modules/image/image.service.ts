import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {CustomUtils} from '../../utils/custom-utils';
import {CategoryService} from '../category/category.service';
import {ImageThemeEnum} from './enums/image-theme.enum';
import {ImageLoaderService} from './image-modules/image-loader/image-loader.service';
import {ImageRepository} from './image.repository';
import {CreateImageDto} from './models/create-image.dto';
import {Image} from './models/image.entity';

@Injectable()
export class ImageService {
    private static THEME_MAP = new Map([
        ['DARK', ImageThemeEnum.DARK],
        ['LIGHT', ImageThemeEnum.LIGHT]
    ]);

    constructor(
        private readonly imageRepository: ImageRepository,
        private imageLoaderService: ImageLoaderService,
        @Inject(forwardRef(() => CategoryService))
        private readonly categoryService: CategoryService
    ) {
    }



    public async createImage(createImageDto: CreateImageDto): Promise<Image> {
        const publicLink = await this.imageLoaderService.loadImage(createImageDto);
        const image = new Image();
        image.uri = publicLink;
        return this.imageRepository.createImage(image);
    }

    public async syncImageWithStorage() {
        const imagesInfo = await this.imageLoaderService.getAllImages();

        imagesInfo.forEach( imageInfo => imageInfo.isActive = this.isActive(imageInfo.path));
        const activeImages = imagesInfo.filter(imageInfo => imageInfo.isActive);
        activeImages.forEach( imageInfo => imageInfo.categoryValue = this.getCategoryValue(imageInfo.path));
        activeImages.forEach( imageInfo => imageInfo.theme = this.getTheme(imageInfo.path));

        const categoryValues = new Set(activeImages.map( imageInfo => imageInfo.categoryValue));
        const categoryValueToId = CustomUtils.getUniqueMapBy(await this.categoryService.getCategoriesByValue([...categoryValues]), 'value');

        const dbImageRecordsMap = CustomUtils.getUniqueMapBy(await this.imageRepository.getAllImages(), 'externalId');

        const upsertPayload: Image[] = this.prepareUpsertPayload(dbImageRecordsMap, imagesInfo, categoryValueToId);
        if(upsertPayload.length > 0) {
            await Image.save(upsertPayload);
        }
        return {result: 'synced'};
    }

    private prepareUpsertPayload(dbImageRecords, cloudImages, categories) : Image[] {
        return cloudImages
            .map( img => {
            let forceUpsert = false;
           let dbImage = dbImageRecords.get(img.externalId) ? dbImageRecords.get(img.externalId)  : new Image();
           if(dbImage.externalId !== img.externalId) forceUpsert = true;
           dbImage.externalId = img.externalId;

           if(dbImage.uri !== img.uri) forceUpsert = true;
           dbImage.uri = img.uri;

           if(dbImage.isActive !== img.isActive) forceUpsert = true;
           dbImage.isActive = img.isActive;
           if(img.isActive) {
               if(dbImage.category == null || dbImage.category.id !== categories.get(img.categoryValue).id) forceUpsert = true;
               dbImage.category = categories.get(img.categoryValue);
               if(dbImage.theme !== img.theme) forceUpsert = true;
               dbImage.theme = img.theme;
           }
           return {forceUpsert: forceUpsert, load: dbImage};
        })
            .filter( syncLoad => syncLoad.forceUpsert)
            .map(syncLoad => syncLoad.load);
    }

    private isActive(path: string): boolean {
        return path.startsWith('/images/inactive/') === false;
    }

    private getTheme(path: string): ImageThemeEnum {
        const defaultPath = '/images/';
        const indexOfThemeFolderEnd = path.indexOf('/', defaultPath.length);
        return ImageService.THEME_MAP.get(path.substring(defaultPath.length, indexOfThemeFolderEnd).toUpperCase());
    }

    private getCategoryValue(path: string) {
        const pathParts = path.split('/');
        return pathParts[pathParts.length - 2];
    }

}