import { FavoriteEventLocationCityDto } from "./favorite-event.location-city.dto";

export class FavoriteEventLocationDto {
    public id: number = null;
    public city: FavoriteEventLocationCityDto = new FavoriteEventLocationCityDto();
    public name: string = null;
    public address: string = null;
    public long: number = null;
    public lat: number = null;
}