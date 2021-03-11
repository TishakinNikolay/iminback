import { Injectable } from "@nestjs/common";
import { ObjectRemapperService } from "../_shared/base/object-remapper.service";
import { EventLocationService } from "./event-modules/event-location/event-location.service";
import { EventRepository } from "./event.repository";
import { CreateEventDto } from "./models/dto/create-event.dto";
import { ResponseEventDto } from "./models/dto/response-event.dto";
import { Event } from "./models/event.entity";

@Injectable()
export class EventService {
    constructor(
        private readonly eventRepository: EventRepository,
        private readonly eventLocationService: EventLocationService,
        private readonly remapper: ObjectRemapperService
    ) {
    }

    public async createEvent(createEventDto: CreateEventDto): Promise<ResponseEventDto> {
        Object.assign(createEventDto.location, await this.eventLocationService.createEventLocation(createEventDto.location));
        const event: Event = Object.assign(new Event(), createEventDto);
        return this.remapper.remap(new ResponseEventDto(), await this.eventRepository.createEvent(event));
        // return this.remapper.remap(ResponseEventDto, await this.eventRepository.createEvent(event));
    }
    public getAllEvents(): Promise<Event[]> {
        return this.eventRepository.getAllEvents();
    }
}