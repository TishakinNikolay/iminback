import { HistoryEventImageDto } from './history-event.image.dto';
import { HistoryEventLocationDto } from './history-event.location.dto';
import { HistoryEventOwnerDto } from './history-event.owner.dto';

export class HistoryEventDto {
  public id: number = null;
  public title: string = null;
  public startTime: Date = new Date();
  public endTime: Date = new Date();
  public owner: HistoryEventOwnerDto = new HistoryEventOwnerDto();
  public description: string = null;
  public image: HistoryEventImageDto = new HistoryEventImageDto();
  public eventLocation: HistoryEventLocationDto = new HistoryEventLocationDto();
  public totalOfPersons: number = null;
  constructor(
  ) { }
}
