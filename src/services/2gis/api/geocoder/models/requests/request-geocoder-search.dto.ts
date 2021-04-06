import {stringify} from 'querystring';

export class RequestGeocoderSearchDto {
    public q: string = null;
    public page_size: number = null;

    constructor(q: string, page_size: number = 10) {
        this.q = q;
        this.page_size = page_size;
    }

    public toQueryParamsString(): string {
        return stringify({...(this as any)});
    }
}