import { FeedEventLocationCityDto } from './feed-event.location-city.dto';

export class FeedEventLocationDto {
    public id: number = null;
    public city: FeedEventLocationCityDto = new FeedEventLocationCityDto();
    public name: string = null;
    public address: string = null;
    public long: number = null;
    public lat: number = null;
}