import { EventReactionType } from "../../../enums/event-reaction-type.enum";
import {EventReactionUserDto} from '../event-reaction.user.dto';

export class EventReactionResponseDto {
    public eventId: number = null;
    public user: EventReactionUserDto = new  EventReactionUserDto();
    public reactionType: EventReactionType = null;
    public createdAt: Date = new Date();
}