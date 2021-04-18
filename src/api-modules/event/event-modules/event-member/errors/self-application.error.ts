import {ResponseError} from '../../../../_shared/models/response-error.model';
import {EventMembeErrorEnum} from '../enums/event-membe-error.enum';

export class SelfApplicationError extends ResponseError {
    public readonly message = 'Cannot apply to own event';
    public readonly statusCode = 400;
    public readonly typeError: string = EventMembeErrorEnum.SELF_EVENT_APPLICATION_ERROR;
    public errorDetails: any;

    constructor(details: any) {
        super();
        this.errorDetails = details;
    }
}