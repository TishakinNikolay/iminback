import {UserCountryDto} from './user-country.dto';

export class UserCityDto {
    public id: number = null;
    public country: UserCountryDto = new UserCountryDto();
}