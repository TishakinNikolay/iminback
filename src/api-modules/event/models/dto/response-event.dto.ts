import { EventImageDto } from "./event-image.dto";
import { EventLocationDto } from "./event-location.dto";
import { EventOwnerDto } from "./event-owner.dto";

export class ResponseEventDto {
  constructor(
    public owner: EventOwnerDto,
    public id: number
  ) { }
}
