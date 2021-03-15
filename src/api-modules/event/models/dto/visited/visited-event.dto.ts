import { VisitedEventImageDto } from "./visited-event.image.dto";
import { VisitedEventLocationDto } from "./visited-event.location.dto";
import { VisitedEventOwnerDto } from "./visited-event.owner.dto";

export class VisitedEventDto {
  public id: number = null;
  public title: string = null;
  public date: Date = new Date();
  public startTime: Date = new Date()
  public endTime: Date = new Date();
  public owner: VisitedEventOwnerDto = new VisitedEventOwnerDto();
  public description: string = null;
  public image: VisitedEventImageDto = new VisitedEventImageDto();
  public eventLocation: VisitedEventLocationDto = new VisitedEventLocationDto();
  public totalOfPersons: number = null;
  constructor(
  ) { }
}
