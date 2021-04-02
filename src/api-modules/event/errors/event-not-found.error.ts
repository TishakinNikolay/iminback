import {IError} from '../../_shared/interfaces/IError';
import {IErrorParams} from '../../_shared/interfaces/IErrorParams';
import {ResponseError} from '../../_shared/models/response-error.model';
import {UserErrorEnum} from '../../user/enums/user-error.enum';
import {EventErrors} from '../enums/event-errors.enum';

export class EventNotFoundError extends ResponseError {
    public readonly message = 'Event not found';
    public readonly statusCode = 404;
    public readonly typeError: string = UserErrorEnum.NOT_FOUND;
    public errorDetails: IError[] = [
        {
            message: 'Event not found',
            type: EventErrors.EVENT_NOT_FOUND,
            details: []
        }
    ];

    constructor(errorParams?: IErrorParams[]) {
        super();
        this.init(errorParams);
    }
}