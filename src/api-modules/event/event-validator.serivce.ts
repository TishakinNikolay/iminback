import { BadRequestException, Injectable } from "@nestjs/common";
import { EventRepository } from "./event.repository";
import { Event } from "./models/event.entity";
import { CreateEventDto } from "./models/dto/create/create-event.dto";
import { ResponseEventDto } from "./models/dto/response/response-event.dto";

@Injectable()
export class EventValidatorService {
    constructor(private readonly eventRepository: EventRepository) {

    }

    public async validateEventTime(ownerId: number, startTime: Date, endTime: Date): Promise<void> {
        const events: number[] = (await this.eventRepository.getTimeIntersectedEvents(
            ownerId,
            startTime,
            endTime)).map(event => event.id);
        if (events.length > 0) {
            throw new BadRequestException('Time range of new event already exist')
        }
    }

    public async validateApplicationEventTime(ownerId: number, startTime: Date, endTime: Date): Promise<void> {
        const events: number[] = (await this.eventRepository.getTimeIntersectedEvents(
            ownerId,
            startTime,
            endTime)).map(event => event.id);
        if (events.length > 0) {
            throw new BadRequestException(
                {
                    statusCode: 400,
                    message: "Collision found",
                    error: events
                });
        }
    }
    public async validateSelfEventApplication(ownerId: number, eventId: number) {
        const targetEvent: ResponseEventDto = await this.eventRepository.getEventById(eventId);
        if (targetEvent.owner.id === ownerId) {
            throw new BadRequestException('You cannot apply to your own event');
        }
    }
}