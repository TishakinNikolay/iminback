import {ResponseError} from '../../_shared/models/response-error.model';
import {EventErrors} from '../enums/event-errors.enum';

export class EventStartTimeError extends ResponseError {
    public readonly message = 'Event start time must be more or equal than today';
    public readonly statusCode = 400;
    public readonly typeError: string = EventErrors.EVENT_START_TIME_LESS_THAN_TODAY;
    public errorDetails: any;

    constructor(details: any) {
        super();
        this.errorDetails = details;
    }
}