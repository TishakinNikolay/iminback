import { BadRequestException, Injectable } from '@nestjs/common';
import {DatetimeService} from '../_shared/datetime.service';
import {EventErrors} from './enums/event-errors.enum';
import {EventCreationTimeOverlapError} from './errors/creation-event-time-overlap.error';
import {EventEndTimeError} from './errors/event-end-time.error';
import {EventStartTimeError} from './errors/event-start-time.error';
import {EventMembeErrorEnum} from './event-modules/event-member/enums/event-membe-error.enum';
import {StatusEnum} from './event-modules/event-member/enums/status.enum';
import {ApplyTimeOverlapError} from './event-modules/event-member/errors/apply-time-overlap.error';
import {SelfApplicationError} from './event-modules/event-member/errors/self-application.error';
import { EventRepository } from './repository/event.repository';
import { ResponseEventDto } from './models/dto/response/response-event.dto';

@Injectable()
export class EventValidatorService {
    constructor(private readonly eventRepository: EventRepository) {

    }

    public async validateEventTime(ownerId: number, startTime: Date, endTime: Date): Promise<void> {
        if (startTime < DatetimeService.now()) {
            throw new EventStartTimeError([{
                type: EventErrors.EVENT_START_TIME_LESS_THAN_TODAY,
                details : `${DatetimeService.formatDateString(startTime)} < ${DatetimeService.nowString()}`
            }]);
        }

        if (endTime <= startTime) {
            throw new EventEndTimeError([{
                type: EventErrors.EVENT_END_TIME_LESS_OR_QUAL_THAN_START_TIME,
                details: `${endTime} <= ${startTime}`
            }]);
        }
        const events: number[] = (await this.eventRepository.getTimeIntersectedEvents(
            ownerId, startTime, endTime, [StatusEnum.APPROVED, StatusEnum.APPLIED]
            )).map(event => event.id);
        if (events.length > 0) {
            throw new EventCreationTimeOverlapError([{
                type : EventErrors.EVENT_CREATION_TIME_OVERLAP,
                details: events
            }]);
        }
    }

    public async validateApplicationEventTime(ownerId: number, startTime: Date, endTime: Date): Promise<void> {
        const events: number[] = (await this.eventRepository.getTimeIntersectedEvents(
            ownerId, startTime, endTime, [StatusEnum.APPROVED]
        )).map(event => event.id);
        if (events.length > 0) {
            throw new ApplyTimeOverlapError([{
                type : EventMembeErrorEnum.APPLICATION__EVENT_TIME_OVERLAP_ERROR,
                details: events
            }]);
        }
    }

    public async validateSelfEventApplication(ownerId: number, eventId: number) {
        const targetEvent = await this.eventRepository.getEventById(eventId);
        if (targetEvent.owner.id === ownerId) {
            throw new SelfApplicationError();
        }
    }
}