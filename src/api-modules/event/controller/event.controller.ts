import {Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards} from '@nestjs/common';
import {LocalGuard} from '../../user/user-modules/auth/guards/local.guard';
import { EventService } from '../event.service';
import { CreateEventDto } from '../models/dto/request/create/create-event.dto';
import {EventOwnerDto} from '../models/dto/request/event-owner.dto';
import { FavoriteEventsRequest } from '../models/dto/request/favorite/favorite-events-request.dto';
import { FeedRequest } from '../models/dto/request/feed/feed-request.dto';
import { HistoryEventsRequest } from '../models/dto/request/history/history-event-request.dto';
import { CreatedEventsRequest } from '../models/dto/request/owner-events/created-events-request.dto';
import { UpcomingEventsRequest } from '../models/dto/request/upcoming/upcoming-events-request.dto';
import { UpdateEventDto } from '../models/dto/request/update/update-event.dto';
import { VisitedEventsRequest } from '../models/dto/request/visited/visited-events-request.dto';
import { eventControllerRegexes } from './event.controller.regex-barrel';

@Controller('event')
export class EventController {
    constructor(private eventService: EventService) { }

    @Post('/create')
    @UseGuards(LocalGuard)
    async createEvent(@Request() req, @Body() createEventDto: CreateEventDto) {
        createEventDto.owner = Object.assign(new EventOwnerDto(), req.user);
        return this.eventService.createEvent(createEventDto);
    }

    @Post('/feed')
    @UseGuards(LocalGuard)
    async getFeedEvents(@Request() req, @Body() feedRequest: FeedRequest) {
        feedRequest.currentUser = Object.assign(new EventOwnerDto(), req.user);
        return this.eventService.getFeedEvents(feedRequest);
    }

    @Get('/created-by-user')
    @UseGuards(LocalGuard)
    async getUserCreatedEvents(@Request() req) {
        const createdEventsReq: CreatedEventsRequest = new CreatedEventsRequest();
        createdEventsReq.currentUser = Object.assign(new EventOwnerDto(), req.user);
        return this.eventService.getUserCreatedEvents(createdEventsReq);
    }

    @Get('/visited')
    @UseGuards(LocalGuard)
    async getVisitedEvents(@Request() req) {
        const visitedEventsReq: VisitedEventsRequest = new VisitedEventsRequest();
        visitedEventsReq.currentUser = Object.assign(new EventOwnerDto(), req.user);
        return this.eventService.getVisitedEvents(visitedEventsReq);
    }

    @Get('/upcoming')
    @UseGuards(LocalGuard)
    async getUpcomingEvents(@Request() req) {
        const upcomingEventsRequest: UpcomingEventsRequest = new UpcomingEventsRequest();
        upcomingEventsRequest.currentUser = Object.assign(new EventOwnerDto(), req.user);
        return this.eventService.getUpcomingEvents(upcomingEventsRequest);
    }

    @Get('/history')
    @UseGuards(LocalGuard)
    async getHistoryEvents(@Request() req) {
        const historyEventsRequest: HistoryEventsRequest = new HistoryEventsRequest();
        historyEventsRequest.currentUser = Object.assign(new EventOwnerDto(), req.user);
        return this.eventService.getHistoryEvents(historyEventsRequest);
    }

    @Get('/favorite')
    @UseGuards(LocalGuard)
    async getFavoriteEvents(@Request() req) {
        const favoriteEventsRequest: FavoriteEventsRequest = new FavoriteEventsRequest();
        favoriteEventsRequest.currentUser = Object.assign(new EventOwnerDto(), req.user);
        return this.eventService.getFavoriteEvents(favoriteEventsRequest);
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

    @Post(eventControllerRegexes.searchRoute)
    @UseGuards(LocalGuard)
    async searchEvents(@Body() searchRequest: any, @Request() request) {
        const searchScope: string = this.parseSearchScope(request.url);
        const searchKeyword: string = this.parseSearchKeyword(request.url);
        searchRequest.currentUser = Object.assign(new EventOwnerDto(), request.user);
        return this.eventService.searchEventsByTitle(searchScope, searchKeyword, searchRequest);
    }

    private parseSearchScope(url): string {
        const firstSlashRemoval = url.substring(0, url.lastIndexOf('/'));
        return firstSlashRemoval.substring(firstSlashRemoval.lastIndexOf('/') + 1);
    }

    private parseSearchKeyword(url): string {
        return url.substring(url.lastIndexOf('/') + 1);
    }
}