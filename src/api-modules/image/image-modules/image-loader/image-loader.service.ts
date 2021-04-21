import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {Dropbox} from 'dropbox';
import * as fs from 'fs';
import {rootPath} from 'get-root-path';
import {nanoid} from 'nanoid';
import {join} from 'path';
import {CreateImageDto} from '../../models/create-image.dto';
import {FileGatewayFactory} from './file-gateway/file-gateway.factory';
import {FileGatewayStrategy} from './file-gateway/strategies/file-gateway-strategy';

@Injectable()
export class ImageLoaderService {
    private fileGateway: FileGatewayStrategy;

    constructor(private configService: ConfigService) {
        this.fileGateway = FileGatewayFactory.getFileGatewayIstance();
    }

    loadImage(image: CreateImageDto): Promise<string> {
        return this.fileGateway.loadToStorage(image);
    }

    getAllImages() {
        return this.fileGateway.getAllImages();
    }
}