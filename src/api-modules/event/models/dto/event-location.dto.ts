import { EventLocationCityDto } from "./event-location-city.dto";

export class EventLocationDto {
    public id: number = null;
    public city: EventLocationCityDto = new EventLocationCityDto();
    public name: string = null;
    public address: string = null;
    public long: number = null;
    public lat: number = null;
    constructor() { }
}