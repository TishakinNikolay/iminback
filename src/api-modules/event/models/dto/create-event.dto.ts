import { EventImageDto } from "./event-image.dto";
import { EventLocationDto } from "./event-location.dto";
import { EventOwnerDto } from "./event-owner.dto";

export class CreateEventDto {
  constructor(
    public title: string,
    public date: Date,
    public startTime: Date,
    public endTime: Date,
    public owner: EventOwnerDto,
    public description: string,
    public image: EventImageDto,
    public location: EventLocationDto,
    public totalOfPersons: string
  ) { }
}
