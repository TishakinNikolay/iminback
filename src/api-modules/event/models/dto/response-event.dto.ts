import { EventImageDto } from "./event-image.dto";
import { EventLocationDto } from "./event-location.dto";
import { EventOwnerDto } from "./event-owner.dto";

export class ResponseEventDto {

  public owner: EventOwnerDto = new EventOwnerDto();
  public image: EventImageDto = new EventImageDto();
  public location: EventLocationDto = new EventLocationDto();
  constructor(
  ) { }
}
