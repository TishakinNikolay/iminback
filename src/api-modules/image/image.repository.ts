import {EntityRepository, Repository} from 'typeorm';
import {Image} from './models/image.entity';

@EntityRepository(Image)
export class ImageRepository extends Repository<Image> {

    async createImage(image: Image): Promise<Image> {
        return this.save(image);
    }

    getAllImages(): Promise<Image[]> {
        return this.find();
    }
}