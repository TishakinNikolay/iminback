import { UpcomingEventLocationCountryDto } from './upcoming-event.location-country.dto';

export class UpcomingEventLocationCityDto {
    public id: number = null;
    public name: string = null;
    public country: UpcomingEventLocationCountryDto = new UpcomingEventLocationCountryDto();
    constructor() {

    }
}