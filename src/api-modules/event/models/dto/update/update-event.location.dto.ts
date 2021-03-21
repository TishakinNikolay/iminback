import { UpdateEventLocationCityDto } from './update-event.location-city.dto';

export class UpdateEventLocationDto {
    public city: UpdateEventLocationCityDto = null;
    public name: string = null;
    public address: string = null;
    public long: number = null;
    public lat: number = null;
    constructor() { }
}