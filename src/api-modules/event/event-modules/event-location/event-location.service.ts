import { Injectable } from '@nestjs/common';
import { scalable } from '../../../_shared/decorators/remap.decorator';
import { EventLocationRepository } from './event-location.repository';
import { CreateEventLocationDto } from './models/dto/create-event-location.dto';
import { ResponseEventLocationDto } from './models/dto/response-event-location.dto';
import { EventLocation } from './models/event-location.entity';

@Injectable()
export class EventLocationService {
    constructor(private eventLocationRepository: EventLocationRepository) {

    }

    @scalable(ResponseEventLocationDto)
    async createEventLocation(createEventLocationDto: CreateEventLocationDto): Promise<EventLocation> {
        const eventLocation: EventLocation = Object.assign(new EventLocation(), createEventLocationDto);
        const existingLocation = await this.eventLocationRepository.getLocationByAddress(eventLocation);
        if (existingLocation) {
            return existingLocation;
        }
        return this.eventLocationRepository.createEventLocation(eventLocation);
    }
}