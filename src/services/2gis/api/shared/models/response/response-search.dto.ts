import {ResponseSearchPointDto} from './response-search-point.dto';
import {ResponseSearchGeometryDto} from './response-search.geometry.dto';

export class ResponseSearchDto {
    public address_name: string;
    public building_name: string;
    public full_name: string;
    public geometry: ResponseSearchGeometryDto;
    public id: string;
    public name: string;
    public point: ResponseSearchPointDto;
    public purpose_name: string;
    public type: string;
}