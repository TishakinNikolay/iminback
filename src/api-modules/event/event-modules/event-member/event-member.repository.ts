import {EntityRepository, Repository, UpdateResult} from 'typeorm';
import {User} from '../../../user/models/user.entity';
import {StatusEnum} from './enums/status.enum';
import {EventMember} from './models/event-member.entity';


@EntityRepository(EventMember)
export class EventMemberRepository extends Repository<EventMember> {
    public async applyMemberToEvent(eventMember: EventMember): Promise<EventMember> {
        return this.save(eventMember);
    }

    public async deleteEventMemberApplitacion(eventMember: EventMember): Promise<void> {
        await this.createQueryBuilder()
            .delete()
            .from(EventMember)
            .where('eventId = :targetEventId', { targetEventId: eventMember.eventId })
            .andWhere('userId = :tartgetUserId', { tartgetUserId: eventMember.userId })
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
                    applicationDate: 'DESC',
                }
            });
    }

    public async getApprovedMembers(eventId: number): Promise<EventMember[]> {
        return this
            .createQueryBuilder('event_member')
            .innerJoinAndSelect(User, "user", "user.id = event_member.userId")
            .innerJoinAndSelect(Event, "event", "event.id = event_member.eventId")
            .where('event_member.eventId = :targetEventId')
            .andWhere('event_member.status = :approvedStatus')
            .orderBy('user.lastName', 'ASC')
            .setParameter('targetEventId', eventId)
            .setParameter('approvedStatus', StatusEnum.APPROVED)
            .getMany();
    }

    public async flushCollisedApplications(startTime: Date, endTime: Date, userId: number) {
        return this
            .createQueryBuilder('event_member')
            .innerJoinAndSelect(Event, "event", "event.id = event_member.eventId")
            .andWhere('event_member.userId = :currentUserId')
            .andWhere('event_member.status = :appliedStatus')
            .andWhere('(event.startTime, event.endTime) OVERLAPS (:startTime, :endTime)')
            .setParameter('currentUserId', userId)
            .setParameter('appliedStatus', StatusEnum.APPLIED)
            .setParameter('startTime', startTime)
            .setParameter('endTime', endTime)
            .delete();
    }

    public async approveEventMember(partialEventMember: EventMember): Promise<UpdateResult> {
        return this.update({ eventId: partialEventMember.eventId, userId: partialEventMember.userId }, partialEventMember);
    }

    public async declineEventMember(partialEventMember: EventMember): Promise<UpdateResult> {
        return this.update({ eventId: partialEventMember.eventId, userId: partialEventMember.userId }, partialEventMember);
    }
    public acceptAll(eventMembers) {
        this.save(eventMembers);
    }
    public async getEventMember(eventId: number, userId: number): Promise<EventMember> {
        return this
            .findOne({
                relations: [
                    'user',
                ],
                where: {
                    eventId: eventId,
                    userId: userId,
                }
            });
    }
}