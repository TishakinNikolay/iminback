import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { EventService } from "./event.service";
import { CreateEventDto } from "./models/dto/create/create-event.dto";
import { CreatedEventsRequest } from "./models/dto/owner-events/created-events-request.dto";
import { FeedRequest } from "./models/dto/feed/feed-request.dto";
import { VisitedEventsRequest } from "./models/dto/visited/visited-events-request.dto";
import { UpcomingEventsRequest } from "./models/dto/upcoming/upcoming-events-request.dto";
import { HistoryEventsRequest } from "./models/dto/history/history-events-request.dto";
import { FavoriteEventsRequest } from "./models/dto/favorite/favorite-events-request.dto";

@Controller('event')
export class EventController {
    constructor(private eventService: EventService) { }

    @Post('/create')
    createEvent(@Body() createEventDto: CreateEventDto) {
        return this.eventService.createEvent(createEventDto);
    }

    @Post('/feed')
    getFeedEvents(@Body() feedRequest: FeedRequest) {
        return this.eventService.getFeedEvents(feedRequest);
    }

    @Post('/created-by-user')
    getUserCreatedEvents(@Body() createdEventsReq: CreatedEventsRequest) {
        return this.eventService.getUserCreatedEvents(createdEventsReq);
    }

    @Post('/visited')
    getVisitedEvents(@Body() visitedEventsReq: VisitedEventsRequest) {
        return this.eventService.getVisitedEvents(visitedEventsReq);

    }

    @Post('/upcoming')
    getUpcomingEvents(@Body() upcomingEventsRequest: UpcomingEventsRequest) {
        return this.eventService.getUpcomingEvents(upcomingEventsRequest);

    }

    @Post('/history')
    getHistoryEvents(@Body() historyEventsRequest: HistoryEventsRequest) {
        return this.eventService.getHistoryEvents(historyEventsRequest);

    }

    @Post('/favorite')
    getFavoriteEvents(@Body() favoriteEventsRequest: FavoriteEventsRequest) {
        return this.eventService.getFavoriteEvents(favoriteEventsRequest);

    }

    @Get('/:id')
    getEventById(@Param('id') eventId: number) {
        return this.eventService.getEventById(eventId);
    }
    @Delete('/:id')
    deleteEventById(@Param('id') eventId: number) {
        return this.eventService.deleteEventById(eventId);
    }
}