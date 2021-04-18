import {ResponseError} from '../../_shared/models/response-error.model';
import {EventErrors} from '../enums/event-errors.enum';

export class EventNotFoundError extends ResponseError {
    public readonly message = 'Event not found';
    public readonly statusCode = 404;
    public readonly typeError: string = EventErrors.EVENT_NOT_FOUND;
    public errorDetails: any;

    constructor(details: any) {
        super();
        this.errorDetails = details;
    }
}