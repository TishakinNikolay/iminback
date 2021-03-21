import { GenderEnum } from '../../../../user/enums/gender.enum';
import { FeedEventImageDto } from './feed-event.image.dto';
import { FeedEventLocationCityDto } from './feed-event.location-city.dto';

export class FeedEventOwnerDto {
    public id: number = null;
    public firstName: string = null;
    public lastName: string = null;
    public profileImage: FeedEventImageDto = new FeedEventImageDto();
    public dateOfBirth: Date = new Date();
    public gender: GenderEnum = null;
    public city: FeedEventLocationCityDto = new FeedEventLocationCityDto();
    constructor() { }
}