import { Injectable } from "@nestjs/common";
import { EventLocationService } from "./event-modules/event-location/event-location.service";
import { EventRepository } from "./event.repository";
import { CreateEventDto } from "./models/dto/create-event.dto";
import { ResponseEventDto } from "./models/dto/response-event.dto"
import { Event } from "./models/event.entity"

@Injectable()
export class EventService {
    constructor(
        private readonly eventRepository: EventRepository,
        private readonly eventLocationService: EventLocationService
    ) {
    }

    public createEvent(createEventDto: CreateEventDto): Promise<ResponseEventDto> {
        const event: Event = Object.assign(new Event(), createEventDto);
        return this.eventRepository.createEvent(event);
    }
    public getAllEvents(): Promise<Event[]> {
        return this.eventRepository.getAllEvents();
    }
}