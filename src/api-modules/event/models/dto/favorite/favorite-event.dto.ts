import { FavoriteEventImageDto } from "./favorite-event.image.dto";
import { FavoriteEventLocationDto } from "./favorite-event.location.dto";
import { FavoriteEventOwnerDto } from "./favorite-event.owner.dto";

export class FavoriteEventDto {
  public id: number = null;
  public title: string = null;
  public startTime: Date = new Date()
  public endTime: Date = new Date();
  public owner: FavoriteEventOwnerDto = new FavoriteEventOwnerDto();
  public description: string = null;
  public image: FavoriteEventImageDto = new FavoriteEventImageDto();
  public eventLocation: FavoriteEventLocationDto = new FavoriteEventLocationDto();
  public totalOfPersons: number = null;
  constructor(
  ) { }
}
