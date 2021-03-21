import { CreatedEventLocationCityDto } from './created-event.location-city.dto';

export class CreatedEventLocationDto {
    public id: number = null;
    public city: CreatedEventLocationCityDto = new CreatedEventLocationCityDto();
    public name: string = null;
    public address: string = null;
    public long: number = null;
    public lat: number = null;
}