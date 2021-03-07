import { EntityRepository, Repository } from "typeorm";
import { Image } from "./models/image.entity";

@EntityRepository(Image)
export class ImageRepository extends Repository<Image>{

    async createImage(publicLink: string): Promise<Image> {
        const image = new Image();
        image.uri = publicLink;
        return this.save(image);
    }

    getAllImages(): Promise<Image[]> {
        return this.find();
    }
}