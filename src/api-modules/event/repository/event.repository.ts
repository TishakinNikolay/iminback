import * as moment from 'moment';
import { createQueryBuilder, EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import {DatetimeService} from '../../_shared/datetime.service';
import {StatusEnum} from '../event-modules/event-member/enums/status.enum';
import { EventMember } from '../event-modules/event-member/models/event-member.entity';
import { EventLocationDto } from '../models/dto/request/event-location.dto';
import { UpdateEventDto } from '../models/dto/request/update/update-event.dto';
import { Event } from '../models/event.entity';
import { LessThan } from "typeorm";
import { EventQueryBuilder } from './event-query-builder';
import { EventSearchEngine } from './search-engine/event-search-engine';

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
        return this.softDelete(eventId);
    }

    public async getFeedEvents(userId: number,
                               userCityId: number,
                               categoriesId: number[],
                               geo: EventLocationDto,
                               targetDate: Date): Promise<Event[]> {
        return this.eventQueryBuilder.getFeedQuery(userId, userCityId, categoriesId, geo, targetDate).getMany();
    }

    public async getUserEvents(userId: number): Promise<Event[]> {
        return this.eventQueryBuilder.getCreatedQuery(userId).getMany();
    }

    public async getUserPassedEvents(userId: number): Promise<Event[]> {
        const currentDate: string = DatetimeService.nowString();
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
                    owner: { id: userId },
                    endTime: LessThan(currentDate)
                },
                order: { endTime: 'DESC' }
            });
    }

    public async getVisitedEvents(userId: number): Promise<Event[]> {
        return this.eventQueryBuilder.getVisitedQuery(userId).getMany();
    }

    public async getUpcomingEvents(userId: number): Promise<Event[]> {
        return this.eventQueryBuilder.getUpcomingQuery(userId).getMany();
    }

    public async getHistoryEvents(userId: number): Promise<Event[]> {
        return this.eventQueryBuilder.getHistoryQuery(userId).getMany();
    }

    public async getFavoriteEvents(userId: number): Promise<Event[]> {
        return this.eventQueryBuilder.getFavoriteQuery(userId).getMany();
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

    public async searchEventsByTitle(searchScope: string, title: string, searchRequest: any): Promise<Event[]> {
        return this.searchEngine.getSearchByTitleQuery(searchScope, title, searchRequest).getMany();
    }
}