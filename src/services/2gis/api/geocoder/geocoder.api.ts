import {stringify} from 'querystring';
import {IConfigApi} from '../../interfaces/IConfig';
import {ResponseSearchPointDto} from '../shared/models/response/response-search-point.dto';
import {ResponseSearchDto} from '../shared/models/response/response-search.dto';
import {ResponseSearchListDto} from '../shared/models/response/response-search.list.dto';
import {ParentApi} from '../shared/parent.api';
import {RequestGeocoderSearchDto} from './models/requests/request-geocoder-search.dto';

export class GeocoderApi extends ParentApi {
    constructor(config: IConfigApi) {
        super(config, '/items/geocode');
    }

    public async search(request: RequestGeocoderSearchDto): Promise<ResponseSearchListDto> {
        console.log(`?q=${request.q}&fields=items.point,items.geometry.centroid`)
        const result = await this.get(`?q=${request.q}&fields=items.point,items.geometry.centroid`);

        return result.body.result;
    }

    public async searchOne(request: ResponseSearchPointDto): Promise<ResponseSearchDto> {
        const result = await this.get(`?${stringify({...request})}&fields=items.point,items.geometry.centroid`);

        return result.body.result.items[0];
    }
}