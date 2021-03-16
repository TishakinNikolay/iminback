import { GenderEnum } from "../../../../user/enums/gender.enum";
import { UpcomingEventImageDto } from "./upcoming-event.image.dto";
import { UpcomingEventLocationCityDto } from "./upcoming-event.location-city.dto";

export class UpcomingEventOwnerDto {
    public id: number = null;
    public firstName: string = null;
    public lastName: string = null;
    public profileImage: UpcomingEventImageDto = new UpcomingEventImageDto();
    public dateOfBirth: Date = new Date();
    public gender: GenderEnum = null;
    public city: UpcomingEventLocationCityDto = new UpcomingEventLocationCityDto();
    constructor() { }
}