import {ResponseError} from '../../_shared/models/response-error.model';
import {EventErrors} from '../enums/event-errors.enum';

export class EventCreationTimeOverlapError extends ResponseError {
    public readonly message = 'Cant be created because of time overlap with other events';
    public readonly statusCode = 400;
    public readonly typeError: string = EventErrors.EVENT_CREATION_TIME_OVERLAP;
    public errorDetails: any;

    constructor(details: any) {
        super();
        this.errorDetails = details;
    }
}