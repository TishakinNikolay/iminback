import {ResponseSearchDto} from './response-search.dto';

export class ResponseSearchListDto {
    public items: ResponseSearchDto[] = null;
    public total = 0;
}