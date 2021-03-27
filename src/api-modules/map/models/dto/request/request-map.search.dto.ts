import {IsNotEmpty, IsString} from 'class-validator';
import {RequestMapPointDto} from './request-map.point.dto';

export class RequestMapSearchDto {
    @IsNotEmpty()
    @IsString()
    public phrase: string;
    public page_size = 10;
    public sortByPoint: RequestMapPointDto = new RequestMapPointDto();
}