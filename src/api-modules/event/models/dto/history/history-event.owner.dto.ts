import { GenderEnum } from '../../../../user/enums/gender.enum';
import { HistoryEventImageDto } from './history-event.image.dto';
import { HistoryEventLocationCityDto } from './history-event.location-city.dto';

export class HistoryEventOwnerDto {
    public id: number = null;
    public firstName: string = null;
    public lastName: string = null;
    public profileImage: HistoryEventImageDto = new HistoryEventImageDto();
    public dateOfBirth: Date = new Date();
    public gender: GenderEnum = null;
    public city: HistoryEventLocationCityDto = new HistoryEventLocationCityDto();
    constructor() { }
}