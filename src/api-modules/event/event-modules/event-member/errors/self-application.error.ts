import {IError} from '../../../../_shared/interfaces/IError';
import {IErrorParams} from '../../../../_shared/interfaces/IErrorParams';
import {ResponseError} from '../../../../_shared/models/response-error.model';
import {EventMembeErrorEnum} from '../enums/event-membe-error.enum';

export class SelfApplicationError extends ResponseError {
    public readonly message = 'Cannot apply to own event';
    public readonly statusCode = 400;
    public readonly typeError: string = EventMembeErrorEnum.SELF_EVENT_APPLICATION_ERROR;
    public errorDetails: IError[] = [
        {
            message: 'Event not found',
            type: EventMembeErrorEnum.SELF_EVENT_APPLICATION_ERROR,
            details: []
        }
    ];

    constructor(errorParams?: IErrorParams[]) {
        super();
        this.init(errorParams);
    }
}