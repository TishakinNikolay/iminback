import { FeedEventImageDto } from './feed-event.image.dto';
import { FeedEventLocationDto } from './feed-event.location.dto';
import { FeedEventOwnerDto } from './feed-event.owner.dto';

export class FeedEventDto {
  public id: number = null;
  public title: string = null;
  public startTime: Date = new Date();
  public endTime: Date = new Date();
  public owner: FeedEventOwnerDto = new FeedEventOwnerDto();
  public description: string = null;
  public image: FeedEventImageDto = new FeedEventImageDto();
  public eventLocation: FeedEventLocationDto = new FeedEventLocationDto();
  public totalOfPersons: number = null;
  constructor(
  ) { }
}
