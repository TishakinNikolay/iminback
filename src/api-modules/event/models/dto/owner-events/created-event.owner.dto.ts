import { GenderEnum } from '../../../../user/enums/gender.enum';
import { CreatedEventImageDto } from './created-event.image.dto';
import { CreatedEventLocationCityDto } from './created-event.location-city.dto';

export class CreatedEventOwnerDto {
    public id: number = null;
    public firstName: string = null;
    public lastName: string = null;
    public profileImage: CreatedEventImageDto = new CreatedEventImageDto();
    public dateOfBirth: Date = new Date();
    public gender: GenderEnum = null;
    public city: CreatedEventLocationCityDto = new CreatedEventLocationCityDto();
    constructor() { }
}