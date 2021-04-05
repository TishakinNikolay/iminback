import { EntityRepository, Repository } from "typeorm";
import {EventReactionType} from './enums/event-reaction-type.enum';
import { EventReaction } from "./models/event-reaction.entity";

@EntityRepository(EventReaction)
export class EventReactionRepository extends Repository<EventReaction> {
    public async addEventReaction(eventReactinon: EventReaction): Promise<EventReaction> {
        return this.save(eventReactinon);
    }

    public async removeEventReaction(eventId: number, userId: number): Promise<void> {
        await this.createQueryBuilder()
            .delete()
            .from(EventReaction)
            .where('eventId = :eventId', {eventId: eventId})
            .andWhere('userId = :userId', {userId: userId})
            .andWhere('reactionType = :reactionType', {reactionType: EventReactionType.ADD_TO_FAVORITE})
            .execute();
    }
}