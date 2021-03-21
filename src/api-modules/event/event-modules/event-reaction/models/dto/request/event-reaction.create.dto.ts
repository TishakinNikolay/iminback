import { EventReactionType } from "../../../enums/event-reaction-type.enum";

export class EventReactionCreateDto {
    public userId: number;
    public eventId: number;
    public reactionType: EventReactionType;
}