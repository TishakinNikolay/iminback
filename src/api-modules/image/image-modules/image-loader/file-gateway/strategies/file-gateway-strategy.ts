import {nanoid} from 'nanoid';
import {CreateImageDto} from '../../../../models/create-image.dto';

export abstract class FileGatewayStrategy {
    public abstract loadToStorage(imageDto : CreateImageDto) : Promise<string>;
    public abstract getAllImages(): Promise<any[]>;

    protected generateImageName(): string {
        return nanoid(30);
    }

    protected getFiletypeFromName(filename: string): string {
        const indexOf = filename.lastIndexOf('.');
        return filename.substring(indexOf + 1);
    }
}