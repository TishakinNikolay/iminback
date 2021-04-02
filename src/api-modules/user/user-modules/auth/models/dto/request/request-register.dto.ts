import { CreateImageDto } from '../../../../../../image/models/create-image.dto';
import { GenderEnum } from '../../../../../enums/gender.enum';
import {UserCityDto} from '../../../../../models/dto/user-city.dto';

export class RequestRegisterDto {
    firstName: string;
    lastName: string;
    nickname: string;
    phone: string;
    city: UserCityDto;
    birthday: Date;
    gender: GenderEnum;
    descriptions: string;
    image?: CreateImageDto;
}