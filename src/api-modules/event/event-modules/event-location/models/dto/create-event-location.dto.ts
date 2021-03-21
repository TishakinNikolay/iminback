import { LocationCityDto } from './location-city.dto';

export class CreateEventLocationDto {
  public city: LocationCityDto;
  public name: string;
  public address: string;
  public long: number;
  public lat: number;
}
