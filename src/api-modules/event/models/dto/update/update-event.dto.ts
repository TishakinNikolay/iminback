import { UpdateEventImageDto } from "./update-event.image.dto";
import { UpdateEventLocationDto } from "./update-event.location.dto";
import { UpdateEventOwnerDto } from "./update-event.owner.dto";

export class UpdateEventDto {

  public id: number;
  public title: string;
  public startTime: Date;
  public endTime: Date;
  public owner: UpdateEventOwnerDto;
  public description: string;
  public image: UpdateEventImageDto;
  public eventLocation: UpdateEventLocationDto;
  public totalOfPersons: string;
  constructor(
  ) { }
}
