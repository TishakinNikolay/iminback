import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateImageDto } from '../../models/create-image.dto';
import { Dropbox } from 'dropbox';
import { nanoid } from 'nanoid';
import { rootPath } from 'get-root-path';
import { join } from 'path';

@Injectable()
export class ImageLoaderService {
    private loaderStrategyMap: Map<string, (image: CreateImageDto) => Promise<string>>
        = new Map<string, (image: CreateImageDto) => Promise<string>>([
            ['DROPBOX', this._loadToDropBox],
            ['LOCAL', this._loadToLocalFs]
        ]);

    private loader: (image: CreateImageDto) => Promise<string>;

    constructor(private configService: ConfigService) {
        const strategyKey = configService.get('IMAGE_STORAGE_STRATEGY');
        this.loader = this._getLoaderStrategy(strategyKey);
    }

    loadImage(image: CreateImageDto): Promise<string> {
        return this.loader(image);
    }

    _getLoaderStrategy(loaderStrategyKey: string): (image: CreateImageDto) => Promise<string> {
        return this.loaderStrategyMap.get(loaderStrategyKey);
    }

    async _loadToDropBox(image: CreateImageDto): Promise<string> {
        let publickRawLink: string = null;
        const dropBoxAccessToken: string = this.configService.get('DROPBOX_ACCESS_TOKEN');
        const fullDbxImagePath = `/images/${this._generateImageName()}`;
        const dbx = new Dropbox({ accessToken: dropBoxAccessToken });
        try {
            const uploadresult = await dbx.filesUpload({ path: fullDbxImagePath, contents: image.buffer });
            const dbxResponse = await dbx.sharingCreateSharedLinkWithSettings({ path: fullDbxImagePath });
            publickRawLink = dbxResponse.result.url + '&raw=1';
        } catch (uploadErr: any) {
            console.log(uploadErr);
        }
        return publickRawLink;
    }

    _loadToLocalFs(image: CreateImageDto): Promise<string> {
        const localImageFolderPath: string = this.configService.get('IMAGE_LOCAL_FOLDER_RELATIVE_PATH');
        const host = this.configService.get('HOST');

        const filetype = this._getFiletypeFromName(image.originalname);
        const fileName = `${this._generateImageName()}.${filetype}`;

        const fullFileName = join(rootPath, localImageFolderPath, fileName);
        const fileDescriptor = fs.openSync(fullFileName, 'as');
        fs.writeSync(fileDescriptor, image.buffer);
        return Promise.resolve(`${host}/${fileName}`);
    }

    _generateImageName(): string {
        return nanoid(30);
    }

    _getFiletypeFromName(filename: string): string {
        const indexOf = filename.lastIndexOf('.');
        return filename.substring(indexOf + 1);
    }
}