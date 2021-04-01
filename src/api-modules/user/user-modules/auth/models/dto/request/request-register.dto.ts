import { UserCityDto } from 'src/api-modules/user/models/dto/user-city.dto';
import { CreateImageDto } from '../../../../../../image/models/create-image.dto';
import { GenderEnum } from '../../../../../enums/gender.enum';

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