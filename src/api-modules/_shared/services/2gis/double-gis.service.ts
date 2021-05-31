import {Injectable} from '@nestjs/common';
import {DoubleGisApi} from './api/2gis.api';
import {IConfigApi} from './interfaces/IConfig';

@Injectable()
export class DoubleGisService {
    public readonly config: IConfigApi;
    public readonly api: DoubleGisApi;

    constructor() {
        this.config = {
            baseUrl: process.env['GIS_API_URL2'],
            auth: {
                key: process.env['GIS_API_KEY2']
            }
        };
        this.api = new DoubleGisApi(this.config);
    }
}