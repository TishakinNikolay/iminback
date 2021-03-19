import { BadRequestException, Injectable } from "@nestjs/common";
import { EventRepository } from "./event.repository";
import { Event } from "./models/event.entity";
import { CreateEventDto } from "./models/dto/create/create-event.dto";

@Injectable()
export class EventValidatorService {
    constructor(private readonly eventRepository: EventRepository) {

    }

    public async validateEventTime(ownerId: number, startTime: Date, endTime: Date): Promise<void> {
        const events: Event[] = await this.eventRepository.getTimeIntersectedEvents(
            ownerId,
            startTime,
            endTime);
        if (events.length > 0) {
            throw new BadRequestException('Time range of new event already exist')
        }
    }
}