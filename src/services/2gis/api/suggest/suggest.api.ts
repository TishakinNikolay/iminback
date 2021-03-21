import {IConfigApi} from '../../interfaces/IConfig';
import {ResponseSearchListDto} from '../shared/models/response/response-search.list.dto';
import {ParentApi} from '../shared/parent.api';
import {RequestSearch} from './models/requests/request-search.dto';

export class SuggestApi extends ParentApi {
    constructor(config: IConfigApi) {
        super(config, '/suggests');
    }

    public async suggestsByAddress(request: RequestSearch): Promise<ResponseSearchListDto> {
        console.log(`?${request.toQueryParamsString()}`);
        const result = await this.get(`?${request.toQueryParamsString()}&fields=items.point,items.geometry.centroid`);

        return result.body.result;
    }
}

// https://catalog.api.2gis.com/3.0/suggests?key=ruwkyx9103&suggest_type=address&page_size=15&locale=ru_UA&q=Одесса, маразли