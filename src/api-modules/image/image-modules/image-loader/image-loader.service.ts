import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {Dropbox} from 'dropbox';
import * as fs from 'fs';
import {rootPath} from 'get-root-path';
import {nanoid} from 'nanoid';
import {join} from 'path';
import {CreateImageDto} from '../../models/create-image.dto';

@Injectable()
export class ImageLoaderService {
    private loaderStrategyMap: Map<string, (image: CreateImageDto) => Promise<string>>;

    private loader: (image: CreateImageDto) => Promise<string>;

    constructor(private configService: ConfigService) {
        this.loaderStrategyMap = new Map<string, (image: CreateImageDto) => Promise<string>>([
            ['DROPBOX', this._loadToDropBox],
            ['LOCAL', this._loadToLocalFs]
        ]);

        const strategyKey = configService.get('IMAGE_STORAGE_STRATEGY');
        this.loader = this._getLoaderStrategy(strategyKey);
    }

    loadImage(image: CreateImageDto): Promise<string> {
        return this.loader(image);
    }

    private _getLoaderStrategy(loaderStrategyKey: string): (image: CreateImageDto) => Promise<string> {
        return this.loaderStrategyMap.get(loaderStrategyKey);
    }

    async _loadToDropBox(image: CreateImageDto): Promise<string> {
        let publickRawLink: string = null;
        const dropBoxAccessToken: string = this.configService.get('DROPBOX_ACCESS_TOKEN');
        const filetype = this._getFiletypeFromName(image.originalname);
        const fullDbxImagePath = `/images/${this._generateImageName()}.${filetype}`;
        const dbx = new Dropbox({accessToken: dropBoxAccessToken});
        try {
            const uploadresult = await dbx.filesUpload({path: fullDbxImagePath, contents: image.buffer});
            const dbxResponse = await dbx.sharingCreateSharedLinkWithSettings({path: fullDbxImagePath});
            publickRawLink = dbxResponse.result.url + '&raw=1';
        } catch (uploadErr: any) {
            console.log(uploadErr);
        }
        return publickRawLink;
    }

    private _loadToLocalFs(image: CreateImageDto): Promise<string> {
        const localImageFolderPath: string = this.configService.get('IMAGE_LOCAL_FOLDER_RELATIVE_PATH');
        const host = this.configService.get('HOST');

        const filetype = this._getFiletypeFromName(image.originalname);
        const fileName = `${this._generateImageName()}.${filetype}`;

        const fullFileName = join(rootPath, localImageFolderPath, fileName);
        const fileDescriptor = fs.openSync(fullFileName, 'as');
        fs.writeSync(fileDescriptor, image.buffer);
        return Promise.resolve(`${host}/${fileName}`);
    }

    private _generateImageName(): string {
        return nanoid(30);
    }

    private _getFiletypeFromName(filename: string): string {
        const indexOf = filename.lastIndexOf('.');
        return filename.substring(indexOf + 1);
    }
}