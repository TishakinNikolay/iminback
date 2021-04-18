import {ResponseError} from '../../../../_shared/models/response-error.model';
import {EventMembeErrorEnum} from '../enums/event-membe-error.enum';


export class ApplyTimeOverlapError extends ResponseError {
    public readonly message = 'You have another events that have time overlap with target event ';
    public readonly statusCode = 400;
    public readonly typeError: string = EventMembeErrorEnum.APPLICATION__EVENT_TIME_OVERLAP_ERROR;
    public errorDetails: any;

    constructor(details: any) {
        super();
        this.errorDetails = details;
    }
}