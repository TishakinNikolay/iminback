import {Injectable} from '@nestjs/common';
import {EventErrors} from './enums/event-errors.enum';
import {EventCreationTimeOverlapError} from './errors/creation-event-time-overlap.error';
import {EventEndTimeError} from './errors/event-end-time.error';
import {EventStartTimeError} from './errors/event-start-time.error';
import {EventMembeErrorEnum} from './event-modules/event-member/enums/event-membe-error.enum';
import {StatusEnum} from './event-modules/event-member/enums/status.enum';
import {ApplyTimeOverlapError} from './event-modules/event-member/errors/apply-time-overlap.error';
import {SelfApplicationError} from './event-modules/event-member/errors/self-application.error';
import {EventRepository} from './repository/event.repository';

@Injectable()
export class EventValidatorService {
    constructor(private readonly eventRepository: EventRepository) {

    }

    public async validateEventTime(ownerId: number, startTime, endTime): Promise<void> {
        if (new Date(startTime) < new Date()) {
            throw new EventStartTimeError([{
                type: EventErrors.EVENT_START_TIME_LESS_THAN_TODAY,
                details: `startTime is ${startTime} lower than now ${new Date()}`
            }]);
        }
        if (new Date(endTime) < new Date(startTime)) {
            throw new EventEndTimeError([{
                type: EventErrors.EVENT_END_TIME_LESS_OR_QUAL_THAN_START_TIME,
                details: `endtime  is ${endTime} lower than ${startTime}`
            }]);
        }
        const eventsD = (await this.eventRepository.getTimeIntersectedEvents(
            ownerId, startTime, endTime, [StatusEnum.APPROVED, StatusEnum.APPLIED]
        ));
        console.log(eventsD);
        const events = eventsD.map(event => event.id);
        if (events.length > 0) {
            throw new EventCreationTimeOverlapError([{
                type: EventErrors.EVENT_CREATION_TIME_OVERLAP,
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
                type: EventMembeErrorEnum.APPLICATION__EVENT_TIME_OVERLAP_ERROR,
                details: events
            }]);
        }
    }

    public async validateSelfEventApplication(ownerId: number, eventId: number) {
        const targetEvent = await this.eventRepository.getEventById(eventId);
        if (targetEvent.owner.id === ownerId) {
            throw new SelfApplicationError({eventId: eventId, ownerId: ownerId});
        }
    }
}