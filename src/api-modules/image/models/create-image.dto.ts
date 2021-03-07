export class CreateImageDto {
    constructor(
        public fieldname: string,
        public originalname: string,
        public encoding: string,
        public mimetype: string,
        public buffer: any,
        public size: number) { }
}