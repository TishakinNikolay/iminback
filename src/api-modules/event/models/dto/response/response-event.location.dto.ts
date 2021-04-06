import {ResponseEventLocationCityDto} from './response-event.location-city.dto';

export class ResponseEventLocationDto {
    public id: number = null;
    public city: ResponseEventLocationCityDto = new ResponseEventLocationCityDto();
    public name: string = null;
    public address: string = null;
    public long: number = null;
    public lat: number = null;

    constructor() {
    }
}