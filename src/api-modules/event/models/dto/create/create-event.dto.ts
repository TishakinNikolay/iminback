import { CreateEventImageDto } from "./create-event.image.dto";
import { CreateEventLocationDto } from "./create-event.location.dto";
import { CreateEventOwnerDto } from "./create-event.owner.dto";

export class CreateEventDto {
  constructor(
    public title: string,
    public date: Date,
    public startTime: Date,
    public endTime: Date,
    public owner: CreateEventOwnerDto,
    public description: string,
    public image: CreateEventImageDto,
    public eventLocation: CreateEventLocationDto,
    public totalOfPersons: string
  ) { }
}
