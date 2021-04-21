import {InternalServerErrorException} from '@nestjs/common';
import fs from 'fs';
import {rootPath} from 'get-root-path';
import {join} from 'path';
import {CreateImageDto} from '../../../../models/create-image.dto';
import {FileGatewayStrategy} from './file-gateway-strategy';

export class LocalFsGatewayStrategy extends FileGatewayStrategy{
    public loadToStorage(imageDto : CreateImageDto): Promise<string> {
        return this.loadToLocalFs(imageDto);
    }

    private loadToLocalFs(image: CreateImageDto): Promise<string> {
        const localImageFolderPath: string = process.env.IMAGE_LOCAL_FOLDER_RELATIVE_PATH;
        const host = process.env.HOST;

        const filetype = this.getFiletypeFromName(image.originalname);
        const fileName = `${this.generateImageName()}.${filetype}`;

        const fullFileName = join(rootPath, localImageFolderPath, fileName);
        const fileDescriptor = fs.openSync(fullFileName, 'as');
        fs.writeSync(fileDescriptor, image.buffer);
        return Promise.resolve(`${host}/${fileName}`);
    }

    getAllImages(): Promise<any[]> {
        if(true) throw new InternalServerErrorException('No Default implementation');
        return Promise.resolve([]);
    }

}