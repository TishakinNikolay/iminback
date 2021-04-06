import {ResponseEventReactionDto} from './response-event-reaction.dto';
import {ResponseEventCategoryDto} from './response-event.category.dto';
import {ResponseEventImageDto} from './response-event.image.dto';
import {ResponseEventLocationDto} from './response-event.location.dto';
import {ResponseEventMemberDto} from './response-event.member.dto';
import {ResponseEventOwnerDto} from './response-event.owner.dto';

export class ResponseEventDto {
    public id: number = null;
    public title: string = null;
    public startTime: Date = new Date();
    public endTime: Date = new Date();
    public owner: ResponseEventOwnerDto = new ResponseEventOwnerDto();
    public description: string = null;
    public image: ResponseEventImageDto = new ResponseEventImageDto();
    public eventLocation: ResponseEventLocationDto = new ResponseEventLocationDto();
    public totalOfPersons: number = null;
    public categories: ResponseEventCategoryDto[] = [new ResponseEventCategoryDto()];
    public eventMembers: ResponseEventMemberDto[] = [new ResponseEventMemberDto()];
    public eventReactions: ResponseEventReactionDto[] = [new ResponseEventReactionDto()];

    constructor() {
    }
}
