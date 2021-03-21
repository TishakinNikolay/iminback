import { VisitedEventLocationCityDto } from './visited-event.location-city.dto';

export class VisitedEventLocationDto {
    public id: number = null;
    public city: VisitedEventLocationCityDto = new VisitedEventLocationCityDto();
    public name: string = null;
    public address: string = null;
    public long: number = null;
    public lat: number = null;
}