import {IConfigApi} from '../../interfaces/IConfig';
import {ResponseSearchListDto} from '../shared/models/response/response-search.list.dto';
import {ParentApi} from '../shared/parent.api';
import {RequestGeocoderSearchDto} from './models/requests/request-geocoder-search.dto';
import {ResponseSearchDto} from '../shared/models/response/response-search.dto';
import {ResponseSearchPointDto} from '../shared/models/response/response-search-point.dto';
import {stringify} from 'querystring';

export class GeocoderApi extends ParentApi {
    constructor(config: IConfigApi) {
        super(config, '/items/geocode');
    }

    public async search(request: RequestGeocoderSearchDto): Promise<ResponseSearchListDto> {
        const result = await this.get(`?${request.toQueryParamsString()}&fields=items.point,items.geometry.centroid`);

        return result.body.result;
    }

    public async searchOne(request: ResponseSearchPointDto): Promise<ResponseSearchDto> {
        const result = await this.get(`?${stringify({...request})}&fields=items.point,items.geometry.centroid`);

        return result.body.result.items[0];
    }
}