import {ResponseEventCategoryDto} from './response-event.category.dto';
import { ResponseEventImageDto } from './response-event.image.dto';
import { ResponseEventLocationDto } from './response-event.location.dto';
import { ResponseEventOwnerDto } from './response-event.owner.dto';

export class ResponseEventDto {
  public id: number = null;
  public title: string = null;
  public startTime: Date = new Date();
  public endTime: Date = new Date();
  public owner: ResponseEventOwnerDto = new ResponseEventOwnerDto();
  public description: string = null;
  public image: ResponseEventImageDto = new ResponseEventImageDto();
  public eventLocation: ResponseEventLocationDto = new ResponseEventLocationDto();
  public totalOfPersons: number;
  public categories : ResponseEventCategoryDto[] = [new ResponseEventCategoryDto()];
  constructor(
  ) { }
}
