import { EntityRepository, Repository } from "typeorm";
import { StatusEnum } from "./enums/status.enum";
import { EventMember } from "./models/event-member.entity";

@EntityRepository(EventMember)
export class EventMemberRepository extends Repository<EventMember> {
    public async applyMemberToEvent(eventMember: EventMember): Promise<EventMember> {
        return this.save(eventMember);
    }

    public async deleteEventMemberApplitacion(eventMember: EventMember): Promise<void> {
        await this.createQueryBuilder()
            .delete()
            .from(EventMember)
            .where("eventId = :targetEventId", { targetEventId: eventMember.eventId })
            .andWhere("userId = :tartgetUserId", { tartgetUserId: eventMember.userId })
            .execute();
    }

    public async getAppliedMembers(eventId: number): Promise<EventMember[]> {
        return this
            .find({
                relations: [
                    'user',
                ],
                where: {
                    eventId: eventId,
                    status: StatusEnum.APPLIED
                },
                order: {
                    applicationDate : 'DESC',
                }
            });
    }
}