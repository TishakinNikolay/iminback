import { CreatedEventLocationCountryDto } from "./created-event.location-country.dto";

export class CreatedEventLocationCityDto {
    public id: number = null;
    public name: string = null;
    public country: CreatedEventLocationCountryDto = new CreatedEventLocationCountryDto();
    constructor() {

    }
}