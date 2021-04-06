import {LocationCityDto} from './location-city.dto';

export class ResponseEventLocationDto {
    public id: number = null;
    public city: LocationCityDto = new LocationCityDto();
    public name: string = null;
    public address: string = null;
    public long: number = null;
    public lat: number = null;
}
