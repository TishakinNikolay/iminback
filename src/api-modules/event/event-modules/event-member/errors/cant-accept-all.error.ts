import {ResponseError} from '../../../../_shared/models/response-error.model';
import {EventMembeErrorEnum} from '../enums/event-membe-error.enum';

export class CantAcceptAllError extends ResponseError {
    public readonly message = 'Cannot accept all';
    public readonly statusCode = 400;
    public readonly typeError: string = EventMembeErrorEnum.CANT_ACCEPT_ALL;
    public errorDetails: any;

    constructor(details: any) {
        super();
        this.errorDetails = details;
    }
}