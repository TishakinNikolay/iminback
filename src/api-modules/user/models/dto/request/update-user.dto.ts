import {GenderEnum} from '../../../enums/gender.enum';
import {UserCityDto} from '../user-city.dto';
import {UserImageDto} from '../user-image.dto';
import {IsNotEmpty} from 'class-validator';

export class UpdateUserDto {
    @IsNotEmpty()
    public firstName: string;
    @IsNotEmpty()
    public lastName: string;
    @IsNotEmpty()
    public dateOfBirth: Date;
    @IsNotEmpty()
    public nickname: string;
    public city?: UserCityDto;
    public gender: GenderEnum;
    public profileImage: UserImageDto;
}