import { ResponseEventImageDto } from './response-event.image.dto';
import { ResponseEventLocationDto } from './response-event.location.dto';
import { ResponseEventOwnerDto } from './response-event.owner.dto';

export class ResponseEventDto {
  public id: number = null;
  public startTime: Date = new Date();
  public endTime: Date = new Date();
  public eventLocation: ResponseEventLocationDto = new ResponseEventLocationDto();
  public owner: ResponseEventOwnerDto = new ResponseEventOwnerDto();
  public image: ResponseEventImageDto = new ResponseEventImageDto();
  constructor(
  ) { }
}
