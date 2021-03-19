import { EntityRepository, Repository } from "typeorm";
import { EventMember } from "./models/event-member.entity";

@EntityRepository(EventMember)
export class EventMemberRepository extends Repository<EventMember> {
    public async applyMemberToEvent(eventMember: EventMember): Promise<EventMember> {
        return this.save(eventMember);
    }
}