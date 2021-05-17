import {GenderEnum} from '../../../enums/gender.enum';
import {UserCityDto} from '../user-city.dto';
import {UserImageDto} from '../user-image.dto';

export class ResponseUserDto {
    public id: number = null;
    public firstName: string = null;
    public lastName: string = null;
    public phone: string = null;
    public profileImage: UserImageDto = new UserImageDto();
    public dateOfBirth: Date = new Date();
    public gender: GenderEnum = null;
    public description: string = null;
    public city?: UserCityDto = new UserCityDto();
    public nickname: string = null;
    public totalOfCreated? : number = 0;
    public totalOfVisited?: number = 0;

}