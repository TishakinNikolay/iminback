import { FavoriteEventLocationCountryDto } from "./favorite-event.location-country.dto";

export class FavoriteEventLocationCityDto {
    public id: number = null;
    public name: string = null;
    public country: FavoriteEventLocationCountryDto = new FavoriteEventLocationCountryDto();
    constructor() {

    }
}