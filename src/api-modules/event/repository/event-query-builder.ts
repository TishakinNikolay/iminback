import { City } from "../../../api-modules/city/city.entity";
import { QueryBuilder, SelectQueryBuilder } from "typeorm";
import {DatetimeService} from '../../_shared/datetime.service';
import { EventLocation } from "../event-modules/event-location/models/event-location.entity";
import { StatusEnum } from "../event-modules/event-member/enums/status.enum";
import { EventMember } from "../event-modules/event-member/models/event-member.entity";
import { EventLocationDto } from "../models/dto/request/event-location.dto";
import { Event } from "../models/event.entity";
import { User } from '../../../api-modules/user/models/user.entity';
import { EventReactionType } from '../event-modules/event-reaction/enums/event-reaction-type.enum';

export class EventQueryBuilder {

    public constructor(private readonly queryBuilder: QueryBuilder<Event>) { }

    public getFeedQuery(userId: number,
                        userCityId: number,
                        categoriesId: number[],
                        geo: EventLocationDto,
                        targetDate: Date): SelectQueryBuilder<Event> {
        const currentDate: string = DatetimeService.nowString();
        const eventQb: SelectQueryBuilder<Event> = new SelectQueryBuilder(this.queryBuilder);
        let eventsQuery = eventQb
            .innerJoinAndSelect('event.eventLocation', 'event_location', 'event_location.id = event.eventLocationId')
            .innerJoinAndSelect('event_location.city', 'city')
            .innerJoinAndSelect('city.country', 'country')
            .leftJoinAndSelect('event.eventMembers', 'event_member', 'event_member.eventId = event.id')
            .leftJoinAndSelect('event.image', 'event_image', 'event_image.id = event.imageId')
            .leftJoinAndSelect('event.categories', 'event_category')
            .leftJoinAndSelect('event.eventReactions', 'event_reaction', 'event_reaction.eventId = event.id')
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
                    .where('event_member.status = :approvedStatus')
                    .groupBy('event_member.eventId')
                    .setParameter('approvedStatus', StatusEnum.APPROVED);
            }
                , 'applications', '\"applications\".\"eventId\" = \"event\".\"id\"')
            .where('event.id NOT IN' +
                eventQb.subQuery().select('event_member.eventId').from(EventMember, 'event_member')
                    .where('event_member.userId = :curUserId').getQuery())
            .andWhere('event.ownerId != :curUserId')
            .andWhere('event.endTime > :todayDate')
            .andWhere('event.totalOfPersons > COALESCE(applications.totalApplications,0)')
            .andWhere('event_reaction.userId = :curUserId')
            .andWhere('event_reaction.reactionType = :reactionType')
            .setParameter('curUserId', userId)
            .setParameter('reactionType', EventReactionType.ADD_TO_FAVORITE)
            .setParameter('todayDate', currentDate);

        if (categoriesId) {
            eventsQuery = eventsQuery.andWhere('event_category.id IN (:...categoriesId)');
            eventsQuery = eventsQuery.setParameter('categoriesId', categoriesId);
        }
        if (geo) {
            eventsQuery = eventsQuery
                .addSelect(`ROUND((earth_distance(ll_to_earth(event_location.lat, event_location.long), ll_to_earth(${geo.lat}, ${geo.long}))/1000)::NUMERIC, 2)`,
                'distance')
                .orderBy('distance', 'ASC');
        } else {
            eventsQuery = eventsQuery
                .andWhere('event_location.cityId = :userCityId')
                .setParameter('userCityId', userCityId);
        }
        if (targetDate) {
            const date = targetDate;
            const dayStart: string = DatetimeService.dayStartString(date);
            const dayEnd: string = DatetimeService.dayEndString(date);
            eventsQuery = eventsQuery
                .andWhere('event.startTime <= :dayEnd')
                .andWhere('event.startTime >= :dayStart')
                .setParameter('dayStart', dayStart)
                .setParameter('dayEnd', dayEnd);
        }

        eventsQuery = eventsQuery
            .addOrderBy('event.startTime', 'ASC')
            .addOrderBy('(event.totalOfPersons - COALESCE(applications.totalApplications,0))', 'ASC')
            .addOrderBy('event.totalOfPersons', 'DESC')
            .addOrderBy('event.imageId', 'DESC', 'NULLS LAST')
            .addOrderBy('COALESCE(categories_for_total.category_num,0)', 'DESC')
            .addOrderBy('event.description', 'DESC', 'NULLS LAST');
        return eventsQuery;
    }

    public getVisitedQuery(userId: number): SelectQueryBuilder<Event> {
        const currentDate: string = DatetimeService.nowString();
        const eventQb: SelectQueryBuilder<Event> = new SelectQueryBuilder(this.queryBuilder);
        return eventQb
            .innerJoinAndSelect('event.eventMembers', 'event_member', 'event_member.eventId = event.id')
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
            .setParameter('currentDate', currentDate);
    }

    public getUpcomingQuery(userId: number): SelectQueryBuilder<Event> {
        const currentDate: string = DatetimeService.nowString();
        const eventQb: SelectQueryBuilder<Event> = new SelectQueryBuilder(this.queryBuilder);
        return eventQb
            .innerJoinAndSelect(EventMember, 'event_member', 'event_member.eventId = event.id')
            .innerJoinAndSelect(User, 'owner', 'owner.id = event.ownerId')
            .innerJoinAndSelect('event.eventLocation', 'event_location', 'event_location.id = event.eventLocationId')
            .innerJoinAndSelect('event_location.city', 'location_city', 'location_city.id = event_location.cityId')
            .leftJoinAndSelect('event.categories', 'event_category')
            .where('event_member.status IN (:...fitStatuses)')
            .orWhere('event.ownerId = :currentUserId')
            .andWhere('event.startTime > :currentDate')
            .orderBy('event.startTime', 'ASC')
            .setParameter('fitStatuses', [StatusEnum.APPROVED, StatusEnum.APPLIED])
            .setParameter('currentUserId', userId)
            .setParameter('currentDate', currentDate);
    }

    public getHistoryQuery(userId: number): SelectQueryBuilder<Event> {
        const currentDate: string = DatetimeService.nowString();
        const eventQb: SelectQueryBuilder<Event> = new SelectQueryBuilder(this.queryBuilder);
        return eventQb
            .leftJoinAndSelect('event.eventMembers', 'event_member', 'event_member.eventId = event.id')
            .leftJoinAndSelect('event.categories', 'event_category')
            .innerJoinAndSelect('event.owner', 'owner', 'owner.id = event.ownerId')
            .innerJoinAndSelect('event.eventLocation', 'event_location', 'event_location.id = event.eventLocationId')
            .innerJoinAndSelect('event_location.city', 'location_city', 'location_city.id = event_location.cityId')
            .where('event_member.status IN (:...checkInStatuses)')
            .andWhere('event_member.userId = :currentUserId')
            .orWhere('event.ownerId = :currentUserId')
            .andWhere('event.endTime < :currentDate')
            .orderBy('event.endTime', 'DESC')
            .setParameter('checkInStatuses', [StatusEnum.APPLIED, StatusEnum.DECLINED, StatusEnum.APPROVED])
            .setParameter('currentUserId', userId)
            .setParameter('currentDate', currentDate);
    }
    public getFavoriteQuery(userId: number): SelectQueryBuilder<Event> {
        const eventQb: SelectQueryBuilder<Event> = new SelectQueryBuilder(this.queryBuilder);
        return eventQb
            .leftJoinAndSelect('event.image', 'event_image', 'event_image.id = event.imageId')
            .leftJoinAndSelect('event.categories', 'event_category')
            .innerJoinAndSelect('event.eventLocation', 'event_location', 'event_location.id = event.eventLocationId')
            .innerJoinAndSelect('event_location.city', 'city')
            .innerJoinAndSelect('city.country', 'country')
            .innerJoinAndSelect('event.eventReactions', 'event_reaction', 'event_reaction.eventId = event.id')
            .innerJoinAndSelect('event.owner', 'owner', 'owner.id = event.ownerId')
            .where('event_reaction.userId = :currentUserId')
            .andWhere('event_reaction.reactionType = :addToFavoriteType')
            .orderBy('event_reaction.createdAt', 'DESC')
            .setParameter('currentUserId', userId)
            .setParameter('addToFavoriteType', EventReactionType.ADD_TO_FAVORITE);
    }
    public getCreatedQuery(userId: number): SelectQueryBuilder<Event> {
        const eventQb: SelectQueryBuilder<Event> = new SelectQueryBuilder(this.queryBuilder);
        return eventQb
            .innerJoinAndSelect('event.eventLocation', 'event_location', 'event_location.id = event.eventLocationId')
            .innerJoinAndSelect('event_location.city', 'city')
            .innerJoinAndSelect('city.country', 'country')
            .leftJoinAndSelect('event.eventMembers', 'event_member', 'event_member.eventId = event.id')
            .leftJoinAndSelect('event.image', 'event_image', 'event_image.id = event.imageId')
            .leftJoinAndSelect('event.categories', 'event_category')
            .where('event.ownerId = :currentUserId')
            .orderBy('event.endTime', 'DESC')
            .setParameter('currentUserId', userId);
    }

    public getTimeCollidedQuery(startTime: Date, endTime: Date, userId: number, memberStatuses: StatusEnum[]): SelectQueryBuilder<Event> {
        const currentDate: string = DatetimeService.nowString();
        const eventQb: SelectQueryBuilder<Event> = new SelectQueryBuilder(this.queryBuilder);
        return eventQb
            .leftJoinAndSelect(EventMember, 'event_member', 'event_member.eventId = event.id')
            .innerJoinAndSelect(User, 'owner', 'owner.id = event.ownerId')
            .where('event_member.status IN (:...fitStatuses)')
            .andWhere('event_member.userId = :currentUserId')
            .orWhere('event.ownerId = :currentUserId')
            .andWhere('(event.startTime, event.endTime) OVERLAPS (:startTime, :endTime)')
            .setParameter('fitStatuses', memberStatuses)
            .setParameter('currentUserId', userId)
            .setParameter('startTime', startTime)
            .setParameter('endTime', endTime)
            .setParameter('currentDate', currentDate);
    }
}