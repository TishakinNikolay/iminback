export class CreateImageDto {
    public fileName: string;
    public originalname: string;
    public encoding: string;
    public mimetype: string;
    public buffer: Buffer;
    public size: number;

    constructor() {
    }
}