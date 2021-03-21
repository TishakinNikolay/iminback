import { GenderEnum } from '../../../../user/enums/gender.enum';
import { VisitedEventImageDto } from './visited-event.image.dto';
import { VisitedEventLocationCityDto } from './visited-event.location-city.dto';

export class VisitedEventOwnerDto {
    public id: number = null;
    public firstName: string = null;
    public lastName: string = null;
    public profileImage: VisitedEventImageDto = new VisitedEventImageDto();
    public dateOfBirth: Date = new Date();
    public gender: GenderEnum = null;
    public city: VisitedEventLocationCityDto = new VisitedEventLocationCityDto();
    constructor() { }
}