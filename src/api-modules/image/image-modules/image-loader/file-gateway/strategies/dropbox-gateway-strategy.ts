import {HttpException, InternalServerErrorException} from '@nestjs/common';
import {Dropbox} from 'dropbox';
import {CustomUtils} from '../../../../../../utils/custom-utils';
import {CreateImageDto} from '../../../../models/create-image.dto';
import {FileGatewayStrategy} from './file-gateway-strategy';

export class DropboxGatewayStrategy extends FileGatewayStrategy {
    private dbx;

    constructor() {
        super();
        this.dbx = new Dropbox({accessToken: process.env.DROPBOX_ACCESS_TOKEN});
    }

    public loadToStorage(imageDto : CreateImageDto): Promise<string> {
        return this.loadToDropBox(imageDto);
    }

    public async getAllImages(): Promise<any[]> {
        let filesMeta = await this.getFilesMeta(); // here can be any object either folder either real file
        let fileIdToSharedLink = CustomUtils.getUniqueMapBy(await this.getSharedLinksMap(), 'id');
        const onlyFiles = filesMeta.filter( meta => meta['.tag'] === 'file');
        const filesWithoutLink = onlyFiles.filter( file => !(fileIdToSharedLink.has(file.id)))
        let sharedLinkForUnsharedFiles = CustomUtils.getUniqueMapBy(await Promise.all(
                filesWithoutLink
                    .map( file => this.createSharedLink(file['path_lower']))), 'id');
        const linksToFileId = new Map([...fileIdToSharedLink, ...sharedLinkForUnsharedFiles]);
        onlyFiles.forEach( file => file.uri = linksToFileId.get(file.id)['uri']);

        return onlyFiles.map( file => {
            return {
                externalId: file['id'],
                uri: file['uri'] + '&raw=1',
                path: file['path_lower'],
                name: file['name']
            }
        });
    }


    private async createSharedLink(path: string) {
        let success = false;
        let tryAfter = 0;
        let result;
        while(success !== true) {
            try {
                result = await this.timeoutPromise(this.dbx, {path: path}, tryAfter);
                success = true;
            } catch (e) {
               tryAfter = Number.parseInt(e.headers['retry-after']) * 1000;
            }
        }
        return result;
    }

    private timeoutPromise(dbx, args,time) {
        return new Promise( function (res, rej){
            setTimeout(async function(pathProps) {
                try {
                    const result = await dbx.sharingCreateSharedLinkWithSettings(pathProps);
                    console.log(result);
                    res({id: result.result.id, uri: result.result.url + '&raw=1'});
                }catch (e) {
                    rej(e);
                }
            }, time, args)
        });
    }
    private async getFilesMeta() {
        let dropboxMetafiles = [];
        let hasMore = true;
        let isFirstList = true;
        let cursor = null;

        while(hasMore) {
            let listResult;
            if(isFirstList) {
                listResult = await this.dbx.filesListFolder({limit:2000, path:'/images', recursive:true});
                isFirstList = false;
            } else {
                listResult = await this.dbx.filesListFolderContinue({cursor: cursor});
            }
            cursor = listResult.result.cursor;
            dropboxMetafiles.push(listResult.result.entries);
            hasMore = listResult.result.has_more;
        }
        return dropboxMetafiles[0];
    }

    private async getSharedLinksMap() {
        let sharedLinksMeta = [];
        let hasMore = true;
        let isFirstList = true;
        let cursor = null;

        while(hasMore) {
            let listResult;
            if(isFirstList) {
                listResult = await this.dbx.sharingListSharedLinks();
                isFirstList = false;
            } else {
                listResult = await this.dbx.sharingListSharedLinks({cursor: cursor});
            }
            cursor = listResult.result.cursor;
            sharedLinksMeta.push(listResult.result.links);
            hasMore = listResult.result.has_more;
        }
        return sharedLinksMeta[0].map( linkMeta =>{return {uri: linkMeta.url, id: linkMeta.id}});
    }

    private async loadToDropBox(image: CreateImageDto): Promise<string> {
        let publickRawLink: string = null;
        const dropBoxAccessToken: string = process.env.DROPBOX_ACCESS_TOKEN;
        const filetype = this.getFiletypeFromName(image.originalname);
        const fullDbxImagePath = `/images/custom/${this.generateImageName()}.${filetype}`;
        try {
            const uploadresult = await this.dbx.filesUpload({path: fullDbxImagePath, contents: image.buffer});
            const dbxResponse = await this.dbx.sharingCreateSharedLinkWithSettings({path: fullDbxImagePath});
            publickRawLink = dbxResponse.result.url + '&raw=1';
        } catch (uploadErr: any) {
            console.log(uploadErr);
            throw new InternalServerErrorException('Image has not been loaded');
        }
        return publickRawLink;
    }
}