import { Body, Controller, Post } from "@nestjs/common";
import { EventService } from "./event.service";
import { CreateEventDto } from "./models/dto/create/create-event.dto";
import { FeedRequest } from "./models/dto/feed/feed-request.dto";

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
}