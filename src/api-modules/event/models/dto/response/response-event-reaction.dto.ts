import {EventReactionType} from '../../../event-modules/event-reaction/enums/event-reaction-type.enum';

export class ResponseEventReactionDto {
    public id: number = null;
    public reactionType: EventReactionType = null;
}