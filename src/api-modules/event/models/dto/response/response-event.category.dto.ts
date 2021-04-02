import {GenderCategoryEnum} from '../../../../category/enums/gender.enum';

export class ResponseEventCategoryDto {
    public id: number = null;
    public name: string = null;
    public value: string = null;
    public gender: GenderCategoryEnum;
}