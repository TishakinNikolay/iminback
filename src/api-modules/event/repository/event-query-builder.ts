import {QueryBuilder, SelectQueryBuilder} from 'typeorm';
import {User} from '../../../api-modules/user/models/user.entity';
import {StatusEnum} from '../event-modules/event-member/enums/status.enum';
import {EventMember} from '../event-modules/event-member/models/event-member.entity';
import {EventReactionType} from '../event-modules/event-reaction/enums/event-reaction-type.enum';
import {EventLocationDto} from '../models/dto/request/event-location.dto';
import {Event} from '../models/event.entity';

export class EventQueryBuilder {

    public constructor(private readonly queryBuilder: QueryBuilder<Event>) {
    }


    public  getFeedQuery(userId: number,
                        userCityId: number,
                        categoriesId: number[],
                        geo: EventLocationDto,
                        targetDate: Date): SelectQueryBuilder<Event> {
        console.log(categoriesId);
        const currentDate: Date = new Date();
        const eventQb: SelectQueryBuilder<Event> = new SelectQueryBuilder(this.queryBuilder);
        let eventsQuery = eventQb
            .innerJoinAndSelect('event.eventLocation', 'event_location', 'event_location.id = event.eventLocationId')
            .innerJoinAndSelect('event_location.city', 'city')
            .innerJoinAndSelect('event.owner', 'owner')
            .innerJoinAndSelect('city.country', 'country')
            .leftJoinAndSelect('event.eventMembers', 'event_member', 'event_member.eventId = event.id')
            .leftJoinAndSelect('event.image', 'event_image', 'event_image.id = event.imageId')
            .leftJoinAndSelect('event.categories', 'event_category')
            .leftJoinAndSelect('event.eventReactions', 'event_reaction', 'event_reaction.eventId = event.id AND ' +
                'event_reaction.userId = :curUserId AND event_reaction.reactionType = :favoriteType')
            .leftJoinAndSelect(subQb => {
                return subQb
                    .select('category_junc.eventId, COUNT(*) AS category_num')
                    .from('event_categories_category', 'category_junc')
                    .groupBy('category_junc.eventId');
            }, 'categories_for_total', '\"categories_for_total\".\"eventId\" = \"event\".\"id\"')
            .leftJoinAndSelect( subQb => {
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
            .andWhere(`event.ownerId != ${userId}`)
            .andWhere('event.endTime > :todayDate')
            .andWhere('event.totalOfPersons > COALESCE(applications.totalApplications,0)')
            .setParameter('curUserId', userId)
            .setParameter('favoriteType', EventReactionType.ADD_TO_FAVORITE)
            .setParameter('todayDate', currentDate);
            console.log(userId);

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
            const dayStart: Date = new Date(date);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd: Date = new Date(date);
            dayEnd.setHours(23, 59, 59, 999);
            eventsQuery = eventsQuery
               .andWhere('event.startTime <= :dayEnd')
               .andWhere('event.startTime >= :dayStart')
                .setParameter('dayStart', dayStart)
                .setParameter('dayEnd', dayEnd);
        }

        eventsQuery.addSelect('event.totalOfPersons - COALESCE(applications.totalApplications,0)', 'differencemembers')
        eventsQuery.addSelect('COALESCE(categories_for_total.category_num,0)', 'is_category_num')

        eventsQuery = eventsQuery
            .addOrderBy('event.startTime', 'ASC')
            .addOrderBy('differencemembers', 'ASC')
            .addOrderBy('event.totalOfPersons', 'DESC')
            // .addOrderBy('event.imageId', 'DESC', 'NULLS LAST')
            .addOrderBy('is_category_num', 'DESC')
            .addOrderBy('event.description', 'DESC', 'NULLS LAST');

        console.log(eventsQuery.getQuery())

        return eventsQuery;
    }

    public getVisitedQuery(userId: number): SelectQueryBuilder<Event> {
        const currentDate: Date = new Date();
        const eventQb: SelectQueryBuilder<Event> = new SelectQueryBuilder(this.queryBuilder);
        return eventQb
            .innerJoinAndSelect('event.eventLocation', 'event_location', 'event_location.id = event.eventLocationId')
            .innerJoinAndSelect('event_location.city', 'city')
            .innerJoinAndSelect('event.owner', 'owner')
            .innerJoinAndSelect('city.country', 'country')
            .leftJoinAndSelect('event.eventMembers', 'event_member', 'event_member.eventId = event.id')
            .leftJoinAndSelect('event.image', 'event_image', 'event_image.id = event.imageId')
            .leftJoinAndSelect('event.categories', 'event_category')
            .leftJoinAndSelect('event.eventReactions', 'event_reaction', 'event_reaction.eventId = event.id')
            .where('event_member.status = :approvedStatus')
            .andWhere('event_member.userId = :currentUserId')
            .andWhere('event.endTime < :currentDate')
            .orderBy('event.endTime', 'DESC')
            .setParameter('approvedStatus', StatusEnum.APPROVED)
            .setParameter('currentUserId', userId)
            .setParameter('currentDate', currentDate);
    }

    public getUpcomingQuery(userId: number): SelectQueryBuilder<Event> {
        const currentDate: Date = new Date();
        const eventQb: SelectQueryBuilder<Event> = new SelectQueryBuilder(this.queryBuilder);
        return eventQb
            .innerJoinAndSelect('event.eventLocation', 'event_location', 'event_location.id = event.eventLocationId')
            .innerJoinAndSelect('event_location.city', 'city')
            .innerJoinAndSelect('event.owner', 'owner')
            .innerJoinAndSelect('city.country', 'country')
            .leftJoinAndSelect('event.eventMembers', 'event_member', 'event_member.eventId = event.id')
            .leftJoinAndSelect('event.image', 'event_image', 'event_image.id = event.imageId')
            .leftJoinAndSelect('event.categories', 'event_category')
            .leftJoinAndSelect('event.eventReactions', 'event_reaction', 'event_reaction.eventId = event.id')
            .where('event_member.status IN (:...fitStatuses)')
            .orWhere('event.ownerId = :currentUserId')
            .andWhere('event.startTime > :currentDate')
            .orderBy('event.startTime', 'ASC')
            .setParameter('fitStatuses', [StatusEnum.APPROVED, StatusEnum.APPLIED])
            .setParameter('currentUserId', userId)
            .setParameter('currentDate', currentDate);
    }

    public getHistoryQuery(userId: number): SelectQueryBuilder<Event> {
        const currentDate: Date = new Date();
        const eventQb: SelectQueryBuilder<Event> = new SelectQueryBuilder(this.queryBuilder);
        const a = eventQb
            .innerJoinAndSelect('event.eventLocation', 'event_location', 'event_location.id = event.eventLocationId')
            .innerJoinAndSelect('event_location.city', 'city')
            .innerJoinAndSelect('event.owner', 'owner')
            .innerJoinAndSelect('city.country', 'country')
            .leftJoinAndSelect('event.eventMembers', 'event_member', 'event_member.eventId = event.id')
            .leftJoinAndSelect('event.image', 'event_image', 'event_image.id = event.imageId')
            .leftJoinAndSelect('event.categories', 'event_category')
            .leftJoinAndSelect('event.eventReactions', 'event_reaction', 'event_reaction.eventId = event.id')
            .where('((event_member.status IN (:...checkInStatuses) AND event_member.userId = :currentUserId) OR (event.ownerId = :currentUserId))')
            .andWhere('event.endTime < :currentDate')
            .orderBy('event.endTime', 'DESC')
            .setParameter('checkInStatuses', [StatusEnum.APPLIED, StatusEnum.DECLINED, StatusEnum.APPROVED])
            .setParameter('currentUserId', userId)
            .setParameter('currentDate', currentDate);
        return a;
    }

    public getFavoriteQuery(userId: number): SelectQueryBuilder<Event> {
        const eventQb: SelectQueryBuilder<Event> = new SelectQueryBuilder(this.queryBuilder);
        return eventQb
            .innerJoinAndSelect('event.eventLocation', 'event_location', 'event_location.id = event.eventLocationId')
            .innerJoinAndSelect('event_location.city', 'city')
            .innerJoinAndSelect('event.owner', 'owner')
            .innerJoinAndSelect('city.country', 'country')
            .leftJoinAndSelect('event.eventMembers', 'event_member', 'event_member.eventId = event.id')
            .leftJoinAndSelect('event.image', 'event_image', 'event_image.id = event.imageId')
            .leftJoinAndSelect('event.categories', 'event_category')
            .leftJoinAndSelect('event.eventReactions', 'event_reaction', 'event_reaction.eventId = event.id')
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
            .innerJoinAndSelect('event.owner', 'owner')
            .innerJoinAndSelect('city.country', 'country')
            .leftJoinAndSelect('event.eventMembers', 'event_member', 'event_member.eventId = event.id')
            .leftJoinAndSelect('event.image', 'event_image', 'event_image.id = event.imageId')
            .leftJoinAndSelect('event.categories', 'event_category')
            .leftJoinAndSelect('event.eventReactions', 'event_reaction', 'event_reaction.eventId = event.id')
            .where('event.ownerId = :currentUserId')
            .orderBy('event.endTime', 'DESC')
            .setParameter('currentUserId', userId);
    }

    public getTimeCollidedQuery(startTime: Date, endTime: Date, userId: number, memberStatuses: StatusEnum[]): SelectQueryBuilder<Event> {
        const currentDate: Date = new Date();
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
