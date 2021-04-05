import {IError} from '../../../../_shared/interfaces/IError';
import {IErrorParams} from '../../../../_shared/interfaces/IErrorParams';
import {ResponseError} from '../../../../_shared/models/response-error.model';
import {EventMembeErrorEnum} from '../enums/event-membe-error.enum';

export class CantAcceptAllError extends ResponseError {
    public readonly message = 'Cannot accept all';
    public readonly statusCode = 400;
    public readonly typeError: string = EventMembeErrorEnum.CANT_ACCEPT_ALL;
    public errorDetails: IError[] = [
        {
            message: 'Cant accept all because no free space for all of applied members',
            type: EventMembeErrorEnum.CANT_ACCEPT_ALL,
            details: []
        }
    ];

    constructor(errorParams?: IErrorParams[]) {
        super();
        this.init(errorParams);
    }
}