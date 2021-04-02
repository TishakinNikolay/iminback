import { BadRequestException, Injectable } from '@nestjs/common';
import {EventErrors} from './enums/event-errors.enum';
import {EventCreationTimeOverlapError} from './errors/creation-event-time-overlap.error';
import {EventMembeErrorEnum} from './event-modules/event-member/enums/event-membe-error.enum';
import {ApplyTimeOverlapError} from './event-modules/event-member/errors/apply-time-overlap.error';
import {SelfApplicationError} from './event-modules/event-member/errors/self-application.error';
import { EventRepository } from './repository/event.repository';
import { ResponseEventDto } from './models/dto/response/response-event.dto';

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
            throw new EventCreationTimeOverlapError([{
                type : EventErrors.EVENT_CREATION_TIME_OVERLAP,
                details: events
            }]);
        }
    }

    public async validateApplicationEventTime(ownerId: number, startTime: Date, endTime: Date): Promise<void> {
        const events: number[] = (await this.eventRepository.getTimeIntersectedEvents(
            ownerId,
            startTime,
            endTime)).map(event => event.id);
        if (events.length > 0) {
            throw new ApplyTimeOverlapError([{
                type : EventMembeErrorEnum.SELF_EVENT_APPLICATION_ERROR,
                details: events
            }]);
        }
    }

    public async validateSelfEventApplication(ownerId: number, eventId: number) {
        const targetEvent: ResponseEventDto = await this.eventRepository.getEventById(eventId);
        if (targetEvent.owner.id === ownerId) {
            throw new SelfApplicationError();
        }
    }
}