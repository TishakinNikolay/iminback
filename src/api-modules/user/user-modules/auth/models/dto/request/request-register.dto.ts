import {CreateImageDto} from '../../../../../../image/models/create-image.dto';
import {GenderEnum} from '../../../../../enums/gender.enum';

export class RequestRegisterDto {
    firstName: string;
    lastName: string;
    nickname: string;
    phone: string;
    city: string;
    birthday: Date;
    gender: GenderEnum;
    descriptions: string;
    image?: CreateImageDto;
}