import { ResponseEventImageDto } from "./response-event.image.dto";
import { ResponseEventLocationDto } from "./response-event.location.dto";
import { ResponseEventOwnerDto } from "./response-event.owner.dto";

export class ResponseEventDto {

  public owner: ResponseEventOwnerDto = new ResponseEventOwnerDto();
  public image: ResponseEventImageDto = new ResponseEventImageDto();
  public id: number = null;
  public eventLocation: ResponseEventLocationDto = new ResponseEventLocationDto();
  constructor(
  ) { }
}
