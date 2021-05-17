import {createQueryBuilder, EntityRepository, LessThan, Repository} from 'typeorm';
import {StatusEnum} from '../event-modules/event-member/enums/status.enum';
import {EventMember} from '../event-modules/event-member/models/event-member.entity';
import {EventLocationDto} from '../models/dto/request/event-location.dto';
import {UpdateEventDto} from '../models/dto/request/update/update-event.dto';
import {Event} from '../models/event.entity';
import {EventQueryBuilder} from './event-query-builder';
import {EventSearchEngine} from './search-engine/event-search-engine';

@EntityRepository(Event)
export class EventRepository extends Repository<Event> {
    private readonly eventQueryBuilder: EventQueryBuilder;
    private readonly searchEngine: EventSearchEngine;

    public constructor() {
        super();
        this.eventQueryBuilder = new EventQueryBuilder(createQueryBuilder(Event, 'event'));
        this.searchEngine = new EventSearchEngine(this.eventQueryBuilder);
    }

    public createEvent(event: Event): Promise<Event> {
        return this.save(event);
    }

    public getAllEvents(): Promise<Event[]> {
        return this.find();
    }

    public async deleteEventById(eventId: number) {
        const eventToDelete = new Event();
        eventToDelete.id = eventId;
        return Event.remove(eventToDelete);
    }

    public async getFeedEvents(userId: number,
                               userCityId: number,
                               categoriesId: number[],
                               geo: EventLocationDto,
                               targetDate: Date,
                               page: number,
                               pageSize: number): Promise<Event[]> {
        return (await this.eventQueryBuilder
            .getFeedQuery(userId, userCityId, categoriesId, geo, targetDate)
            .getMany()).splice(pageSize * page, pageSize);
    }

    public async getUserEvents(userId: number, page, pageSize): Promise<Event[]> {
        return this.eventQueryBuilder.getCreatedQuery(userId)
            .skip(page * pageSize)
            .take(pageSize)
            .getMany();
    }

    public async getUserPassedEvents(userId: number): Promise<Event[]> {
        const currentDate: Date = new Date();
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
                where: {
                    owner: {id: userId},
                    endTime: LessThan(currentDate)
                },
                order: {endTime: 'DESC'}
            });
    }

    public async getVisitedEvents(userId: number, page: number, pageSize: number): Promise<Event[]> {
        return this.eventQueryBuilder.getVisitedQuery(userId)
            .skip(page * pageSize)
            .take(pageSize)
            .getMany();
    }

    public async getUpcomingEvents(userId: number, page: number, pageSize: number): Promise<Event[]> {
        return this.eventQueryBuilder.getUpcomingQuery(userId)
            .skip(page * pageSize)
            .take(pageSize)
            .getMany();
    }

    public async getHistoryEvents(userId: number, page: number, pageSize: number): Promise<Event[]> {
        return this.eventQueryBuilder.getHistoryQuery(userId)
            .skip(page * pageSize)
            .take(pageSize)
            .getMany();
    }

    public async getFavoriteEvents(userId: number, page: number, pageSize: number): Promise<Event[]> {
        return this.eventQueryBuilder.getFavoriteQuery(userId)
            .skip(page * pageSize)
            .take(pageSize)
            .getMany();
    }

    public getTimeIntersectedEvents(userId: number, startTime: Date, endTime: Date, memberStatuses: StatusEnum[]): Promise<Event[]> {
        return this
            .eventQueryBuilder.getTimeCollidedQuery(startTime, endTime, userId, memberStatuses)
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
                    'eventMembers.user',
                    'eventMembers.user.profileImage',
                    'categories',
                    'eventReactions'
                ],
                where: {id: eventId}
            });
    }

    public async flushEventMembers(createEventDto: UpdateEventDto) {
        return this.createQueryBuilder()
            .delete()
            .from(EventMember)
            .where('eventId = :id', {id: createEventDto.id})
            .execute();
    }

    public async updateEvent(event: Event): Promise<Event> {
        await this.save(event);
        //await this.update({ id: event.id, }, event);
        return this.getEventById(event.id);
    }

    public async searchEventsByTitle(searchScope: string,
                                     title: string,
                                     searchRequest: any,
                                     page: number,
                                     pageSize: number): Promise<Event[]> {
        return this.searchEngine.getSearchByTitleQuery(searchScope, title, searchRequest)
            .skip(page * pageSize)
            .take(pageSize)
            .getMany();
    }
}