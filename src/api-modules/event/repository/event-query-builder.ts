import * as moment from 'moment';
import { City } from "../../../api-modules/city/city.entity";
import { QueryBuilder, SelectQueryBuilder } from "typeorm";
import { EventLocation } from "../event-modules/event-location/models/event-location.entity";
import { StatusEnum } from "../event-modules/event-member/enums/status.enum";
import { EventMember } from "../event-modules/event-member/models/event-member.entity";
import { EventLocationDto } from "../models/dto/request/event-location.dto";
import { Event } from "../models/event.entity";
import { User } from '../../../api-modules/user/models/user.entity';
import { EventReactionType } from '../event-modules/event-reaction/enums/event-reaction-type.enum';
import { EventReaction } from '../event-modules/event-reaction/models/event-reaction.entity';

export class EventQueryBuilder {

    public constructor(private readonly queryBuilder: QueryBuilder<Event>) { }

    public getFeedQuery(userId: number, userCityId: number, categoriesId: number[], geo: EventLocationDto, targetDate: Date): SelectQueryBuilder<Event> {
        const currentDate: string = moment().utc().format('YYYY-MM-DD kk:mm:ss');
        const eventQb: SelectQueryBuilder<Event> = new SelectQueryBuilder(this.queryBuilder);
        let eventsQuery = eventQb
            .innerJoinAndSelect('event.eventLocation', 'event_location', 'event_location.id = event.eventLocationId')
            .innerJoinAndSelect('event_location.city', 'city')
            .innerJoinAndSelect('city.country', 'country')
            .leftJoinAndSelect('event.eventMembers', 'event_member', 'event_member.eventId = event.id')
            .leftJoinAndSelect('event.image', 'event_image', 'event_image.id = event.imageId')
            .leftJoinAndSelect('event.categories', 'event_category')
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
                    .setParameter('appliedStatus', StatusEnum.APPROVED);
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
        if (geo) {
            eventsQuery = eventsQuery.addSelect(`ROUND((earth_distance(ll_to_earth(event_location.lat, event_location.long), ll_to_earth(${geo.lat}, ${geo.long}))/1000)::NUMERIC, 2)`,
                'distance');
        }
        if (targetDate) {
            const dayStart = new Date(targetDate);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(targetDate);
            dayEnd.setHours(23, 59, 59, 59);
            eventsQuery = eventsQuery
                .andWhere('event.startTime <= :dayEnd')
                .andWhere('event.startTime >= :dayStart')
                .setParameter('dayStart', dayStart)
                .setParameter('dayEnd', dayEnd)
        }

        eventsQuery = eventsQuery
            .orderBy(`distance`, 'ASC')
            .addOrderBy('event.startTime', 'ASC')
            .addOrderBy('(event.totalOfPersons - COALESCE(applications.totalApplications,0))', 'ASC')
            .addOrderBy('event.totalOfPersons', 'ASC')
            .addOrderBy('event.imageId', 'DESC', 'NULLS LAST')
            .addOrderBy('COALESCE(categories_for_total.category_num,0)', 'DESC')
            .addOrderBy('event.description', 'DESC', 'NULLS LAST');
        return eventsQuery;
    }

    public getVisitedQuery(userId: number): SelectQueryBuilder<Event> {
        const currentDate: string = moment().utc().format('YYYY-MM-DD kk:mm:ss');
        const eventQb: SelectQueryBuilder<Event> = new SelectQueryBuilder(this.queryBuilder);
        return eventQb
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
    }

    public getUpcomingQuery(userId: number): SelectQueryBuilder<Event> {
        const currentDate: string = moment().utc().format('YYYY-MM-DD kk:mm:ss');
        const eventQb: SelectQueryBuilder<Event> = new SelectQueryBuilder(this.queryBuilder);
        return eventQb
            .innerJoinAndSelect(EventMember, 'event_member', 'event_member.eventId = event.id')
            .innerJoinAndSelect(User, 'owner', 'owner.id = event.ownerId')
            .innerJoinAndSelect(EventLocation, 'event_location', 'event_location.id = event.eventLocationId')
            .innerJoinAndSelect(City, 'location_city', 'location_city.id = event_location.cityId')
            .leftJoinAndSelect('event.categories', 'event_category')
            .where('event_member.status IN (:...fitStatuses)')
            .orWhere('event.ownerId = :currentUserId')
            .andWhere('event.startTime > :currentDate')
            .orderBy('event.startTime', 'ASC')
            .setParameter('fitStatuses', [StatusEnum.APPROVED, StatusEnum.APPLIED])
            .setParameter('currentUserId', userId)
            .setParameter('currentDate', currentDate)
    }

    public getHistoryQuery(userId: number): SelectQueryBuilder<Event> {
        const currentDate: string = moment().utc().format('YYYY-MM-DD kk:mm:ss');
        const eventQb: SelectQueryBuilder<Event> = new SelectQueryBuilder(this.queryBuilder);
        return eventQb
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
    }
    public getFavoriteQuery(userId: number): SelectQueryBuilder<Event> {
        const eventQb: SelectQueryBuilder<Event> = new SelectQueryBuilder(this.queryBuilder);
        return eventQb
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
    }
    public getCreatedQuery(userId: number): SelectQueryBuilder<Event> {
        const eventQb: SelectQueryBuilder<Event> = new SelectQueryBuilder(this.queryBuilder);
        return eventQb
            .leftJoinAndSelect(EventMember, 'event_member', 'event_member.eventId = event.id')
            .innerJoinAndSelect(User, 'owner', 'owner.id = event.ownerId')
            .innerJoinAndSelect(EventLocation, 'event_location', 'event_location.id = event.eventLocationId')
            .innerJoinAndSelect(City, 'location_city', 'location_city.id = event_location.cityId')
            .leftJoinAndSelect('event.categories', 'event_category')
            .where('event.ownerId = :currentUserId')
            .orderBy('event.endTime', 'DESC')
            .setParameter('currentUserId', userId)
    }

    public getTimeIntersectedQuery(userId: number, startTime: Date, endTime: Date): SelectQueryBuilder<Event> {
        const eventQb: SelectQueryBuilder<Event> = new SelectQueryBuilder(this.queryBuilder);
        return eventQb
            .leftJoinAndSelect(EventMember, 'event_member', 'event_member.eventId = event.id')
            .innerJoinAndSelect(User, 'owner', 'owner.id = event.ownerId')
            .where('event_member.status IN (:...fitStatuses)')
            .andWhere('event_member.userId = :currentUserId OR event.ownerId = :currentUserId')
            .andWhere('(event.startTime, event.endTime) OVERLAPS (:startTime, :endTime)')
            .setParameter('fitStatuses', [StatusEnum.APPROVED, StatusEnum.APPLIED])
            .setParameter('currentUserId', userId)
            .setParameter('startTime', startTime)
            .setParameter('endTime', endTime)
    }
}