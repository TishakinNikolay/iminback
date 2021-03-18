import { CreateEventLocationCityDto } from './create-event.location-city.dto';

export class CreateEventLocationDto {
    public city: CreateEventLocationCityDto = null;
    public name: string = null;
    public address: string = null;
    public long: number = null;
    public lat: number = null;
    constructor() { }
}