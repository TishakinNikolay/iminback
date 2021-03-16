import { GenderEnum } from "../../../../user/enums/gender.enum";
import { FavoriteEventImageDto } from "./favorite-event.image.dto";
import { FavoriteEventLocationCityDto } from "./favorite-event.location-city.dto";

export class FavoriteEventOwnerDto {
    public id: number = null;
    public firstName: string = null;
    public lastName: string = null;
    public profileImage: FavoriteEventImageDto = new FavoriteEventImageDto();
    public dateOfBirth: Date = new Date();
    public gender: GenderEnum = null;
    public city: FavoriteEventLocationCityDto = new FavoriteEventLocationCityDto();
    constructor() { }
}