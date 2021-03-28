import { Injectable } from '@nestjs/common';
import { ResponseUserDto } from '../user/models/dto/response/response-user.dto';
import { UserService } from '../user/user.service';
import { scalable, scalableBulk } from '../_shared/decorators/remap.decorator';
import { EventLocationService } from './event-modules/event-location/event-location.service';
import { EventValidatorService } from './event-validator.serivce';
import { EventRepository } from './repository/event.repository';
import { CreateEventDto } from './models/dto/request/create/create-event.dto';
import { FeedRequest } from './models/dto/request/feed/feed-request.dto';
import { HistoryEventsRequest } from './models/dto/request/history/history-event-request.dto';
import { CreatedEventsRequest } from './models/dto/request/owner-events/created-events-request.dto';
import { ResponseEventDto } from './models/dto/response/response-event.dto';
import { UpcomingEventsRequest } from './models/dto/request/upcoming/upcoming-events-request.dto';
import { UpdateEventDto } from './models/dto/request/update/update-event.dto';
import { VisitedEventsRequest } from './models/dto/request/visited/visited-events-request.dto';
import { Event } from './models/event.entity';
import { EventOwnerDto } from './models/dto/request/event-owner.dto';

@Injectable()
export class EventService {
    constructor(
        private readonly eventRepository: EventRepository,
        private readonly eventValidatorSerivce: EventValidatorService,
        private readonly eventLocationService: EventLocationService,
        private readonly userService: UserService
    ) {
    }

    @scalable(ResponseEventDto)
    public async createEvent(createEventDto: CreateEventDto): Promise<Event> {
        await this.eventValidatorSerivce.validateEventTime(createEventDto.owner.id, createEventDto.startTime, createEventDto.endTime);
        Object.assign(createEventDto.eventLocation, await this.eventLocationService.createEventLocation(createEventDto.eventLocation));
        const event: Event = Object.assign(new Event(), createEventDto);
        return this.eventRepository.createEvent(event);
    }

    public getAllEvents(): Promise<Event[]> {
        return this.eventRepository.getAllEvents();
    }

    @scalableBulk(ResponseEventDto)
    public async getFeedEvents(feedRequest: FeedRequest): Promise<Event[]> {
        const user: ResponseUserDto = await this.userService.getUserById(feedRequest.currentUser.id);
        const categoriesId = feedRequest.categories.map(category => category.id);
        return this.eventRepository.getFeedEvents(user.id, user.city.id, categoriesId, feedRequest.location, feedRequest.targetDate);
    }

    @scalableBulk(ResponseEventDto)
    public async getUserCreatedEvents(createdEventsReq: CreatedEventsRequest): Promise<Event[]> {
        const currentUser: EventOwnerDto = createdEventsReq.currentUser;
        return this.eventRepository.getUserEvents(currentUser.id);
    }

    @scalableBulk(ResponseEventDto)
    public async getVisitedEvents(visitedEventsReq: VisitedEventsRequest) {
        return this.eventRepository.getVisitedEvents(visitedEventsReq.currentUser.id);
    }

    @scalableBulk(ResponseEventDto)
    public async getUpcomingEvents(upcomingEventsRequest: UpcomingEventsRequest) {
        return this.eventRepository.getUpcomingEvents(upcomingEventsRequest.currentUser.id);
    }

    @scalableBulk(ResponseEventDto)
    public async getHistoryEvents(historyEventsRequest: HistoryEventsRequest) {
        return (await Promise.all([
            this.eventRepository.getHistoryEvents(historyEventsRequest.currentUser.id),
            this.eventRepository.getUserPassedEvents(historyEventsRequest.currentUser.id)
        ])).flat();
    }

    @scalableBulk(ResponseEventDto)
    public async getFavoriteEvents(favoriteEventsRequest: HistoryEventsRequest) {
        return this.eventRepository.getFavoriteEvents(favoriteEventsRequest.currentUser.id);
    }

    @scalable(ResponseEventDto)
    public async getEventById(eventId: number) {
        return this.eventRepository.getEventById(eventId);
    }

    public async deleteEventById(eventId: number) {
        return this.eventRepository.deleteEventById(eventId);
    }

    @scalable(ResponseEventDto)
    public async updateEvent(updateEventDto: UpdateEventDto): Promise<Event> {
        try {
            await this.eventValidatorSerivce.validateEventTime(updateEventDto.owner.id, updateEventDto.startTime, updateEventDto.endTime);
        } catch (e: any) {
            throw e;
        }
        if (updateEventDto.startTime || updateEventDto.endTime) {
            await this.eventRepository.flushEventMembers(updateEventDto);
        }
        return this.eventRepository.updateEvent(Object.assign(new Event(), updateEventDto));
    }

    @scalableBulk(ResponseEventDto)
    public async searchEventsByTitle(searchScope: string, title: string, searchRequest: any): Promise<Event[]> {
        return this.eventRepository.searchEventsByTitle(searchScope, title, searchRequest);
    }
}