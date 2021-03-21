import { EntityRepository, Repository } from "typeorm";
import { EventReaction } from "./models/event-reaction.entity";

@EntityRepository(EventReaction)
export class EventReactionRepository extends Repository<EventReaction> {
    public async addEventReaction(eventReactinon: EventReaction): Promise<EventReaction> {
        return this.save(eventReactinon);
    }
    
}