import {Module} from '@nestjs/common';
import {ImageLoaderService} from './image-loader.service';

@Module({
    providers: [ImageLoaderService],
    exports: [ImageLoaderService]
})
export class ImageLoaderModule {
}