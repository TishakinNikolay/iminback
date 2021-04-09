import {Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards} from '@nestjs/common';
import {LocalGuard} from '../../user/user-modules/auth/guards/local.guard';
import {EventService} from '../event.service';
import {CreateEventDto} from '../models/dto/request/create/create-event.dto';
import {EventLocationDto} from '../models/dto/request/event-location.dto';
import {EventOwnerDto} from '../models/dto/request/event-owner.dto';
import {FavoriteEventsRequest} from '../models/dto/request/favorite/favorite-events-request.dto';
import {FeedRequest} from '../models/dto/request/feed/feed-request.dto';
import {HistoryEventsRequest} from '../models/dto/request/history/history-event-request.dto';
import {CreatedEventsRequest} from '../models/dto/request/owner-events/created-events-request.dto';
import {UpcomingEventsRequest} from '../models/dto/request/upcoming/upcoming-events-request.dto';
import {UpdateEventDto} from '../models/dto/request/update/update-event.dto';
import {VisitedEventsRequest} from '../models/dto/request/visited/visited-events-request.dto';

@Controller('event')
export class EventController {
    constructor(private eventService: EventService) {
    }

    @Post('/create')
    @UseGuards(LocalGuard)
    async createEvent(@Request() req, @Body() createEventDto: CreateEventDto) {
        createEventDto.owner = Object.assign(new EventOwnerDto(), req.user);
        return this.eventService.createEvent(createEventDto);
    }

    @Get('/feed')
    @UseGuards(LocalGuard)
    async getFeedEvents(@Request() req, @Query() query) {
        const feedRequest: FeedRequest = new FeedRequest();
        if (query.categories) {
            feedRequest.categories = JSON.parse(query.categories);
        }
        if (query.targetDate) {
            feedRequest.targetDate = new Date(query.targetDate);
        }
        if (query.location) {
            const coords = JSON.parse(query.location);
            const locationDto: EventLocationDto = new EventLocationDto();
            locationDto.long = coords.long;
            locationDto.lat = coords.lat;
            feedRequest.location = locationDto;
        }
        const page = query.page;
        const pageSize = query.pageSize;
        feedRequest.currentUser = Object.assign(new EventOwnerDto(), req.user);
        return this.eventService.getFeedEvents(feedRequest, page, pageSize);
    }

    @Get('/created-by-user')
    @UseGuards(LocalGuard)
    async getUserCreatedEvents(@Request() req, @Query() query) {
        const createdEventsReq: CreatedEventsRequest = new CreatedEventsRequest();
        createdEventsReq.currentUser = Object.assign(new EventOwnerDto(), req.user);
        const page = query.page;
        const pageSize = query.pageSize;
        return this.eventService.getUserCreatedEvents(createdEventsReq, page, pageSize);
    }

    @Get('/visited')
    @UseGuards(LocalGuard)
    async getVisitedEvents(@Request() req, @Query() query) {
        const visitedEventsReq: VisitedEventsRequest = new VisitedEventsRequest();
        visitedEventsReq.currentUser = Object.assign(new EventOwnerDto(), req.user);
        const page = query.page;
        const pageSize = query.pageSize;
        return this.eventService.getVisitedEvents(visitedEventsReq, page, pageSize);
    }

    @Get('/upcoming')
    @UseGuards(LocalGuard)
    async getUpcomingEvents(@Request() req, @Query() query) {
        const upcomingEventsRequest: UpcomingEventsRequest = new UpcomingEventsRequest();
        upcomingEventsRequest.currentUser = Object.assign(new EventOwnerDto(), req.user);
        const page = query.page;
        const pageSize = query.pageSize;
        return this.eventService.getUpcomingEvents(upcomingEventsRequest, page, pageSize);
    }

    @Get('/history')
    @UseGuards(LocalGuard)
    async getHistoryEvents(@Request() req, @Query() query) {
        const historyEventsRequest: HistoryEventsRequest = new HistoryEventsRequest();
        historyEventsRequest.currentUser = Object.assign(new EventOwnerDto(), req.user);
        const page = query.page;
        const pageSize = query.pageSize;
        return this.eventService.getHistoryEvents(historyEventsRequest, page, pageSize);
    }

    @Get('/favorite')
    @UseGuards(LocalGuard)
    async getFavoriteEvents(@Request() req, @Query() query) {
        const favoriteEventsRequest: FavoriteEventsRequest = new FavoriteEventsRequest();
        favoriteEventsRequest.currentUser = Object.assign(new EventOwnerDto(), req.user);
        const page = query.page;
        const pageSize = query.pageSize;
        return this.eventService.getFavoriteEvents(favoriteEventsRequest, page, pageSize);
    }

    @Get('/:id')
    @UseGuards(LocalGuard)
    async getEventById(@Param('id') eventId: number) {
        return this.eventService.getEventById(eventId);
    }

    @Delete('/:id')
    @UseGuards(LocalGuard)
    async deleteEventById(@Param('id') eventId: number) {
        await this.eventService.deleteEventById(eventId);
    }

    @Put('/:id')
    @UseGuards(LocalGuard)
    async updateEvent(@Request() req, @Body() updateEventDto: UpdateEventDto, @Param('id') eventId: number) {
        updateEventDto.owner = Object.assign(new EventOwnerDto(), req.user);
        updateEventDto.id = eventId;
        return this.eventService.updateEvent(updateEventDto);
    }

    @Get('/search/:searchMode/:target')
    @UseGuards(LocalGuard)
    async searchEvents(@Request() request, @Param('searchMode') searchMode: string, @Param('target') target: string, @Query() query) {
        const searchReq = {currentUser: {}, location: {}};
        if (query.location) {
            const coords = JSON.parse(query.location);
            searchReq.location = coords;
        }
        const page = query.page;
        const pageSize = query.pageSize;
        searchReq.currentUser = Object.assign(new EventOwnerDto(), request.user);
        return this.eventService.searchEventsByTitle(searchMode, target, searchReq, page, pageSize);
    }
}