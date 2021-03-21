import { FeedEventLocationCountryDto } from './feed-event.location-country.dto';

export class FeedEventLocationCityDto {
    public id: number = null;
    public name: string = null;
    public country: FeedEventLocationCountryDto = new FeedEventLocationCountryDto();
    constructor() {

    }
}