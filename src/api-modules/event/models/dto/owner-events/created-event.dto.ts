import { CreatedEventImageDto } from './created-event.image.dto';
import { CreatedEventLocationDto } from './created-event.location.dto';
import { CreatedEventOwnerDto } from './created-event.owner.dto';

export class CreatedEventDto {
  public id: number = null;
  public title: string = null;
  public startTime: Date = new Date();
  public endTime: Date = new Date();
  public owner: CreatedEventOwnerDto = new CreatedEventOwnerDto();
  public description: string = null;
  public image: CreatedEventImageDto = new CreatedEventImageDto();
  public eventLocation: CreatedEventLocationDto = new CreatedEventLocationDto();
  public totalOfPersons: number = null;
  constructor(
  ) { }
}
