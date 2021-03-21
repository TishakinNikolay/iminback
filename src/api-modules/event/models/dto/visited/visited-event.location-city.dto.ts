import { VisitedEventLocationCountryDto } from './visited-event.location-country.dto';

export class VisitedEventLocationCityDto {
    public id: number = null;
    public name: string = null;
    public country: VisitedEventLocationCountryDto = new VisitedEventLocationCountryDto();
    constructor() {

    }
}