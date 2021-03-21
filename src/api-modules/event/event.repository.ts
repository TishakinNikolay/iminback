import * as moment from 'moment';
import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { City } from '../city/city.entity';
import { User } from '../user/models/user.entity';
import { EventLocation } from './event-modules/event-location/models/event-location.entity';
import { StatusEnum } from './event-modules/event-member/enums/status.enum';
import { EventMember } from './event-modules/event-member/models/event-member.entity';
import { EventReactionType } from './event-modules/event-reaction/enums/event-reaction-type.enum';
import { EventReaction } from './event-modules/event-reaction/models/event-reaction.entity';
import { FeedRequestLocation } from './models/dto/feed/feed-request-location.dto';
import { UpdateEventDto } from './models/dto/update/update-event.dto';
import { Event } from './models/event.entity';

@EntityRepository(Event)
export class EventRepository extends Repository<Event> {
    public createEvent(event: Event): Promise<Event> {
        return this.save(event);
    }

    public getAllEvents(): Promise<Event[]> {
        return this.find();
    }

    public async deleteEventById(eventId: number) {
        return this.delete(eventId);
    }

    public async getFeedEvents(userId: number, userCityId: number, categoriesId: number[], geo: FeedRequestLocation): Promise<Event[]> {
        const currentDate: Date = new Date();
        const eventQb: SelectQueryBuilder<Event> = this.createQueryBuilder('event');
        let eventsQuery = eventQb
            .innerJoinAndSelect('event.eventLocation', 'event_location', 'event_location.id = event.eventLocationId')
            .innerJoinAndSelect('event_location.city', 'city')
            .innerJoinAndSelect('city.country', 'country')
            .leftJoin('event.categories', 'event_category')
            .leftJoinAndSelect(subQb => {
                return subQb
                    .select('category_junc.eventId, COUNT(*) AS category_num')
                    .from('event_categories_category', 'category_junc')
                    .groupBy('category_junc.eventId');
            }, 'categories_for_total', '\"categories_for_total\".\"eventId\" = \"event\".\"id\"'
            )
            .leftJoinAndSelect(subQb => {
                return subQb
                    .select('event_member.eventId, COUNT(*) as totalApplications')
                    .from(EventMember, 'event_member')
                    .where('event_member.status = :appliedStatus')
                    .groupBy('event_member.eventId')
                    .setParameter('appliedStatus', StatusEnum.APPLIED);
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
            eventsQuery = eventsQuery.andWhere('event_category.id IN (:...categoriesId)');
            eventsQuery = eventsQuery.setParameter('categoriesId', categoriesId);
        }
        console.log('geo', geo);
        if (geo) {
            eventsQuery = eventsQuery.addSelect(`ROUND((earth_distance(ll_to_earth(event_location.lat, event_location.long), ll_to_earth(${geo.lat}, ${geo.long}))/1000)::NUMERIC, 2)`,
                'distance');
        }

        eventsQuery = eventsQuery
            .orderBy(`distance`, 'ASC')
            .addOrderBy('event.startTime', 'ASC')
            .addOrderBy('COALESCE(applications.totalApplications,0)', 'ASC')
            .addOrderBy('COALESCE(categories_for_total.category_num,0)', 'DESC')
            .addOrderBy('event.imageId', 'DESC', 'NULLS LAST')
            .addOrderBy('event.description', 'DESC', 'NULLS LAST');
        console.log(eventsQuery.getQueryAndParameters());

        return eventsQuery.getMany();
    }

    public async getUserEvents(userId: number): Promise<Event[]> {
        return this
            .find({
                relations: [
                    'owner',
                    'image',
                    'eventLocation',
                    'eventLocation.city',
                    'eventMembers',
                    'categories'
                ],
                where: { owner: { id: userId } },
                order: { createdAt: 'DESC' }
            });
    }

    public async getVisitedEvents(userId: number): Promise<Event[]> {
        const currentDate: string = moment().utc().format('YYYY-MM-DD kk:mm:ss');
        return this
            .createQueryBuilder('event')
            .innerJoinAndSelect(EventMember, 'event_member', 'event_member.eventId = event.id')
            .innerJoinAndSelect('event.owner', 'owner', 'owner.id = event.ownerId')
            .innerJoinAndSelect(EventLocation, 'event_location', 'event_location.id = event.eventLocationId')
            .innerJoinAndSelect(City, 'location_city', 'location_city.id = event_location.cityId')
            .leftJoinAndSelect('event.categories', 'event_category')
            .where('event_member.status = :approvedStatus')
            .andWhere('event_member.userId = :currentUserId')
            .andWhere('event.endTime < :currentDate')
            .orderBy('event.endTime', 'DESC')
            .setParameter('approvedStatus', StatusEnum.APPROVED)
            .setParameter('currentUserId', userId)
            .setParameter('currentDate', currentDate)
            .getMany();
    }

    public async getUpcomingEvents(userId: number): Promise<Event[]> {
        const currentDate: string = moment().utc().format('YYYY-MM-DD kk:mm:ss');
        return this
            .createQueryBuilder('event')
            .innerJoinAndSelect(EventMember, 'event_member', 'event_member.eventId = event.id')
            .innerJoinAndSelect(User, 'owner', 'owner.id = event.ownerId')
            .innerJoinAndSelect(EventLocation, 'event_location', 'event_location.id = event.eventLocationId')
            .innerJoinAndSelect(City, 'location_city', 'location_city.id = event_location.cityId')
            .leftJoinAndSelect('event.categories', 'event_category')
            .where('event_member.status = :approvedStatus')
            .andWhere('event_member.userId = :currentUserId')
            .andWhere('event.startTime > :currentDate')
            .orderBy('event.startTime', 'ASC')
            .setParameter('approvedStatus', StatusEnum.APPROVED)
            .setParameter('currentUserId', userId)
            .setParameter('currentDate', currentDate)
            .getMany();
    }

    public async getHistoryEvents(userId: number): Promise<Event[]> {
        const currentDate: string = moment().utc().format('YYYY-MM-DD kk:mm:ss');
        return this
            .createQueryBuilder('event')
            .innerJoinAndSelect(EventMember, 'event_member', 'event_member.eventId = event.id')
            .innerJoinAndSelect(User, 'owner', 'owner.id = event.ownerId')
            .innerJoinAndSelect(EventLocation, 'event_location', 'event_location.id = event.eventLocationId')
            .innerJoinAndSelect(City, 'location_city', 'location_city.id = event_location.cityId')
            .leftJoinAndSelect('event.categories', 'event_category')
            .where('event_member.status IN (:...checkInStatuses)')
            .andWhere('event_member.userId = :currentUserId')
            .andWhere('event.endTime < :currentDate')
            .orderBy('event.endTime', 'DESC')
            .setParameter('checkInStatuses', [StatusEnum.APPLIED, StatusEnum.DECLINED, StatusEnum.APPROVED])
            .setParameter('currentUserId', userId)
            .setParameter('currentDate', currentDate)
            .getMany();
    }

    public async getFavoriteEvents(userId: number): Promise<Event[]> {
        return this
            .createQueryBuilder('event')
            .innerJoinAndSelect(EventMember, 'event_member', 'event_member.eventId = event.id')
            .innerJoinAndSelect(EventReaction, 'event_reaction', 'event_reaction.eventId = event.id')
            .innerJoinAndSelect(User, 'owner', 'owner.id = event.ownerId')
            .innerJoinAndSelect(EventLocation, 'event_location', 'event_location.id = event.eventLocationId')
            .innerJoinAndSelect(City, 'location_city', 'location_city.id = event_location.cityId')
            .leftJoinAndSelect('event.categories', 'event_category')
            .where('event_reaction.userId = :currentUserId')
            .andWhere('event_reaction.reactionType = :addToFavoriteType')
            .orderBy('event_reaction.createdAt', 'DESC')
            .setParameter('currentUserId', userId)
            .setParameter('addToFavoriteType', EventReactionType.ADD_TO_FAVORITE)
            .getMany();
    }

    public getTimeIntersectedEvents(userId: number, startTime: Date, endTime: Date): Promise<Event[]> {
        return this
            .createQueryBuilder('event')
            .leftJoinAndSelect(EventMember, 'event_member', 'event_member.eventId = event.id')
            .innerJoinAndSelect(User, 'owner', 'owner.id = event.ownerId')
            .where('event_member.status = :approvedStatus')
            .andWhere('event_member.userId = :currentUserId OR event.ownerId = :currentUserId')
            .andWhere('(event.startTime, event.endTime) OVERLAPS (:startTime, :endTime)')
            .setParameter('approvedStatus', StatusEnum.APPROVED)
            .setParameter('currentUserId', userId)
            .setParameter('startTime', startTime)
            .setParameter('endTime', endTime)
            .getMany();
    }

    public getEventById(eventId: number) {
        return this
            .findOne({
                relations: [
                    'owner',
                    'image',
                    'eventLocation',
                    'eventLocation.city',
                    'eventMembers',
                    'categories'
                ],
                where: { id: eventId }
            });
    }

    public async flushEventMembers(createEventDto: UpdateEventDto) {
        return this.createQueryBuilder()
            .delete()
            .from(EventMember)
            .where('eventId = :id', { id: createEventDto.id })
            .execute();
    }

    public async updateEvent(event: Event): Promise<Event> {
        await this.update({ id: event.id, }, event);
        return this.getEventById(event.id);
    }

    public async getEventsByCityId(cityId: number): Promise<Event[]> {
        return await this.find({
            where: {
                cityId
            }
        });
    }
}