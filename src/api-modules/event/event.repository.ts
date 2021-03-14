import { EntityRepository, Repository, SelectQueryBuilder } from "typeorm";
import { EventMember } from "./event-modules/event-member/event-member.entity";
import { Event } from "./models/event.entity";
import * as moment from 'moment';
import { StatusEnum } from "./event-modules/event-member/enums/status.enum";
import { EventLocation } from "./event-modules/event-location/models/event-location.entity";
import { Category } from "../category/category.entity";

@EntityRepository(Event)
export class EventRepository extends Repository<Event>{
    public createEvent(event: Event): Promise<Event> {
        return this.save(event);
    }

    public getAllEvents(): Promise<Event[]> {
        return this.find();
    }

    public async getFeedEvents(userId: number, userCityId: number, categoriesId: number[]): Promise<Event[]> {
        const currentDate: string = moment().utc().format('YYYY-MM-DD kk:mm:ss');
        const eventQb: SelectQueryBuilder<Event> = this.createQueryBuilder('event');
        let eventsQuery = eventQb
            .innerJoinAndSelect(EventLocation, 'event_location', 'event_location.id = event.eventLocationId')
            .leftJoin('event.categories', 'event_category')
            .leftJoinAndSelect(subQb => {
                return subQb
                    .select('event_member.eventId, COUNT(*) as totalApplications')
                    .from(EventMember, 'event_member')
                    .where('event_member.status = :appliedStatus')
                    .groupBy('event_member.eventId')
                    .setParameter('appliedStatus', StatusEnum.APPLIED)
            }
                , 'applications', '\"applications\".\"eventId\" = \"event\".\"id\"')
            .where('event.id NOT IN' +
                eventQb.subQuery().select('event_member.eventId').from(EventMember, 'event_member')
                    .where('event_member.userId = :curUserId').getQuery())
            .andWhere('event.ownerId != :curUserId')
            .andWhere('event.endTime > :todayDate')
            .andWhere('event.totalOfPersons > COALESCE(applications.totalApplications,0)')
            .andWhere('event_location.cityId = :userCityId')
            .setParameter('curUserId', userId)
            .setParameter('todayDate', currentDate)
            .setParameter('userCityId', userCityId);
        if (categoriesId.length > 0) {
            eventsQuery = eventsQuery.andWhere('event_category.id IN (:...categoriesId)')
            eventsQuery = eventsQuery.setParameter('categoriesId', categoriesId);
        }
        eventsQuery.orderBy('')
        return eventsQuery.getMany();
    }
}