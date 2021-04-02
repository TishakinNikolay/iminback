import {IError} from '../../_shared/interfaces/IError';
import {IErrorParams} from '../../_shared/interfaces/IErrorParams';
import {ResponseError} from '../../_shared/models/response-error.model';
import {UserErrorEnum} from '../../user/enums/user-error.enum';
import {EventErrors} from '../enums/event-errors.enum';

export class EventCreationTimeOverlapError extends ResponseError {
    public readonly message = 'Cant be created because of time overlap with other events';
    public readonly statusCode = 400;
    public readonly typeError: string = UserErrorEnum.NOT_FOUND;
    public errorDetails: IError[] = [
        {
            message: 'Cant be created because of time overlap with other events',
            type: EventErrors.EVENT_CREATION_TIME_OVERLAP,
            details: []
        }
    ];

    constructor(errorParams?: IErrorParams[]) {
        super();
        this.init(errorParams);
    }
}