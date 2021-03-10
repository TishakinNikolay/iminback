import { Injectable } from "@nestjs/common";
import { EventLocationRepository } from "./event-location.repository";
import { CreateEventLocationDto } from "./models/dto/create-event-location.dto";
import { EventLocation } from "./models/event-location.entity";
import { ResponseEventLocationDto } from "./models/dto/response-event-location.dto";

@Injectable()
export class EventLocationService {
    constructor(private eventLocationRepository:  EventLocationRepository) {

    }

    createEventLocation(createEventLocationDto: CreateEventLocationDto) : Promise<ResponseEventLocationDto> {
        const eventLocation : EventLocation = Object.assign(new EventLocation(), createEventLocationDto);
        return this.eventLocationRepository.createEventLocation(eventLocation);
    }
}