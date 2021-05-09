import {Injectable} from '@nestjs/common';
import {DoubleGisApi} from './api/2gis.api';
import {IConfigApi} from './interfaces/IConfig';

@Injectable()
export class DoubleGisService {
    public readonly config: IConfigApi;
    public readonly api: DoubleGisApi;

    constructor() {
        this.config = {
            baseUrl: process.env['2GIS_API_URL'],
            auth: {
                key: process.env['2GIS_API_KEY']
            }
        };
        this.api = new DoubleGisApi(this.config);
    }
}