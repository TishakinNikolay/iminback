import {IError} from '../../_shared/interfaces/IError';
import {IErrorParams} from '../../_shared/interfaces/IErrorParams';
import {ResponseError} from '../../_shared/models/response-error.model';
import {EventErrors} from '../enums/event-errors.enum';

export class EventEndTimeError extends ResponseError {
    public readonly message = 'Event end time must be more  than start time';
    public readonly statusCode = 400;
    public readonly typeError: string = EventErrors.EVENT_END_TIME_LESS_OR_QUAL_THAN_START_TIME;
    public errorDetails: IError[] = [
        {
            message: 'Event end time must be more  than start time',
            type: EventErrors.EVENT_END_TIME_LESS_OR_QUAL_THAN_START_TIME,
            details: []
        }
    ];

    constructor(errorParams?: IErrorParams[]) {
        super();
        this.init(errorParams);
    }
}