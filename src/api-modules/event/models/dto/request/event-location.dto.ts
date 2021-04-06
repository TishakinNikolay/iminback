import {EventLocationCityDto} from './event-location-city.dto';

export class EventLocationDto {
    public city: EventLocationCityDto;
    public name: string;
    public address: string;
    public long: number;
    public lat: number;

    constructor() {
    }
}