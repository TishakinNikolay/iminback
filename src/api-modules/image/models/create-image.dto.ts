export class CreateImageDto {
    public fieldname: string;
    public originalname: string;
    public encoding: string;
    public mimetype: string;
    public buffer: Buffer;
    public size: number;

    constructor() {
    }
}