import {IError} from '../../_shared/interfaces/IError';
import {IErrorParams} from '../../_shared/interfaces/IErrorParams';
import {ResponseError} from '../../_shared/models/response-error.model';
import {EventErrors} from '../enums/event-errors.enum';

export class EventStartTimeError extends ResponseError {
    public readonly message = 'Event start time must be more or equal than today';
    public readonly statusCode = 400;
    public readonly typeError: string = EventErrors.EVENT_START_TIME_LESS_THAN_TODAY;
    public errorDetails: IError[] = [
        {
            message: 'Event start time must be more or equal than today',
            type: EventErrors.EVENT_START_TIME_LESS_THAN_TODAY,
            details: []
        }
    ];

    constructor(errorParams?: IErrorParams[]) {
        super();
        this.init(errorParams);
    }
}