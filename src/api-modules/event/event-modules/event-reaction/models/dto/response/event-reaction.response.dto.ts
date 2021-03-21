import { EventReactionType } from "../../../enums/event-reaction-type.enum";

export class EventReactionResponseDto {
    public eventId: number = null;
    public userId: number = null;
    public reactionType: EventReactionType = null;
    public createdAt: Date = new Date();
}