import {CreateImageDto} from '../../../../image/models/create-image.dto';
import {GenderEnum} from '../../../enums/gender.enum';
import {UserCityDto} from '../user-city.dto';

export class CreateUserDto {
    public firstName: string;
    public lastName: string;
    public phone: string;
    public image: CreateImageDto;
    public dateOfBirth: Date;
    public gender: GenderEnum;
    public city?: UserCityDto;
    public nickname: string;
}