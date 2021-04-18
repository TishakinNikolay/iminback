import {ResponseError} from '../../../../_shared/models/response-error.model';
import {EventMembeErrorEnum} from '../enums/event-membe-error.enum';

export class NoFreePlacesError extends ResponseError {
    public readonly message = 'No free space';
    public readonly statusCode = 400;
    public readonly typeError: string = EventMembeErrorEnum.NO_FREE_SPACE;
    public errorDetails: any;

    constructor(details: any) {
        super();
        this.errorDetails = details;
    }
}