import {IConfigApi} from '../interfaces/IConfig';
import {GeocoderApi} from './geocoder/geocoder.api';
import {SuggestApi} from './suggest/suggest.api';

export class DoubleGisApi {
    private readonly _config: IConfigApi;
    private readonly _suggestApi: SuggestApi;
    private readonly _geocodeApi: GeocoderApi;

    constructor(config: IConfigApi) {
        this._config = config;
        this._suggestApi = new SuggestApi(this._config);
        this._geocodeApi = new GeocoderApi(this._config);
    }

    public get suggestApi(): SuggestApi {
       return this._suggestApi;
    }

    public get geocodeApi(): GeocoderApi {
        return this._geocodeApi;
    }
}