import {IError} from '../../../../_shared/interfaces/IError';
import {IErrorParams} from '../../../../_shared/interfaces/IErrorParams';
import {ResponseError} from '../../../../_shared/models/response-error.model';
import {EventMembeErrorEnum} from '../enums/event-membe-error.enum';

export class NoFreePlacesError extends ResponseError {
    public readonly message = 'No free space';
    public readonly statusCode = 400;
    public readonly typeError: string = EventMembeErrorEnum.NO_FREE_SPACE;
    public errorDetails: IError[] = [
        {
            message: 'Cant apply because no free space on event',
            type: EventMembeErrorEnum.NO_FREE_SPACE,
            details: []
        }
    ];

    constructor(errorParams?: IErrorParams[]) {
        super();
        this.init(errorParams);
    }
}