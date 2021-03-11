import { Body, Controller, Post } from "@nestjs/common";
import { EventService } from "./event.service";
import { CreateEventDto } from "./models/dto/request/create-event.dto";

@Controller('event')
export class EventController {
    constructor(private eventService: EventService) { }
    
    @Post('/create')
    createEvent(@Body() createEventDto: CreateEventDto) {
        return this.eventService.createEvent(createEventDto);
    }
}