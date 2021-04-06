import {EventReactionType} from '../../../enums/event-reaction-type.enum';
import {EventReactionUserDto} from '../event-reaction.user.dto';

export class EventReactionCreateDto {
    public user: EventReactionUserDto;
    public eventId: number;
    public reactionType: EventReactionType;
}