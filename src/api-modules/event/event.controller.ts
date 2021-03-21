import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './models/dto/request/create/create-event.dto';
import { FavoriteEventsRequest } from './models/dto/request/favorite/favorite-events-request.dto';
import { FeedRequest } from './models/dto/request/feed/feed-request.dto';
import { HistoryEventsRequest } from './models/dto/request/history/history-event-request.dto';
import { CreatedEventsRequest } from './models/dto/request/owner-events/created-events-request.dto';
import { UpcomingEventsRequest } from './models/dto/request/upcoming/upcoming-events-request.dto';
import { UpdateEventDto } from './models/dto/request/update/update-event.dto';
import { VisitedEventsRequest } from './models/dto/request/visited/visited-events-request.dto';

@Controller('event')
export class EventController {
    constructor(private eventService: EventService) { }

    @Post('/create')
    async createEvent(@Body() createEventDto: CreateEventDto) {
        return this.eventService.createEvent(createEventDto);
    }

    @Post('/feed')
    async getFeedEvents(@Body() feedRequest: FeedRequest) {
        return this.eventService.getFeedEvents(feedRequest);
    }

    @Post('/created-by-user')
    async getUserCreatedEvents(@Body() createdEventsReq: CreatedEventsRequest) {
        return this.eventService.getUserCreatedEvents(createdEventsReq);
    }

    @Post('/visited')
    async getVisitedEvents(@Body() visitedEventsReq: VisitedEventsRequest) {
        return this.eventService.getVisitedEvents(visitedEventsReq);

    }

    @Post('/upcoming')
    async getUpcomingEvents(@Body() upcomingEventsRequest: UpcomingEventsRequest) {
        return this.eventService.getUpcomingEvents(upcomingEventsRequest);
    }

    @Post('/history')
    async getHistoryEvents(@Body() historyEventsRequest: HistoryEventsRequest) {
        return this.eventService.getHistoryEvents(historyEventsRequest);
    }

    @Post('/favorite')
    async getFavoriteEvents(@Body() favoriteEventsRequest: FavoriteEventsRequest) {
        return this.eventService.getFavoriteEvents(favoriteEventsRequest);
    }

    @Get('/:id')
    async getEventById(@Param('id') eventId: number) {
        return this.eventService.getEventById(eventId);
    }

    @Delete('/:id')
    async deleteEventById(@Param('id') eventId: number) {
        await this.eventService.deleteEventById(eventId);
    }

    @Put('/:id')
    async updateEvent(@Body() updateEventDto: UpdateEventDto, @Param('id') eventId: number) {
        updateEventDto.id = eventId;
        return this.eventService.updateEvent(updateEventDto);
    }
}