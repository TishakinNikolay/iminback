import { GenderEnum } from "../enums/gender.enum";
import { UserCityDto } from "./user-city.dto";
import { UserImageDto } from "./user-image.dto";

export class CreateUserDto {
    public firstName: string;
    public lastName: string;
    public phone: string;
    public profileImage: UserImageDto;
    public dateOfBirth: Date;
    public gender: GenderEnum;
    public city?: UserCityDto;
}