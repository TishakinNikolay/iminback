import {ResponseError} from '../../_shared/models/response-error.model';
import {EventErrors} from '../enums/event-errors.enum';

export class EventEndTimeError extends ResponseError {
    public readonly message = 'Event end time must be more  than start time';
    public readonly statusCode = 400;
    public readonly typeError: string = EventErrors.EVENT_END_TIME_LESS_OR_QUAL_THAN_START_TIME;
    public errorDetails: any;

    constructor(details: any) {
        super();
        this.errorDetails = details;
    }
}