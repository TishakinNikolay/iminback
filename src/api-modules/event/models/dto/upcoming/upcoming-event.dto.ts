import { UpcomingEventImageDto } from './upcoming-event.image.dto';
import { UpcomingEventLocationDto } from './upcoming-event.location.dto';
import { UpcomingEventOwnerDto } from './upcoming-event.owner.dto';

export class UpcomingEventDto {
  public id: number = null;
  public title: string = null;
  public startTime: Date = new Date();
  public endTime: Date = new Date();
  public owner: UpcomingEventOwnerDto = new UpcomingEventOwnerDto();
  public description: string = null;
  public image: UpcomingEventImageDto = new UpcomingEventImageDto();
  public eventLocation: UpcomingEventLocationDto = new UpcomingEventLocationDto();
  public totalOfPersons: number = null;
  constructor(
  ) { }
}
