import {ResponseError} from '../../_shared/models/response-error.model';
import {IError} from '../../_shared/interfaces/IError';
import {IErrorParams} from '../../_shared/interfaces/IErrorParams';
import {UserErrorEnum} from '../enums/user-error.enum';

export class UserFindError extends ResponseError {
    public readonly message = 'User Not Found';
    public readonly statusCode = 404;
    public readonly typeError: string = UserErrorEnum.NOT_FOUND;
    public errorDetails: IError[] = [
        {
            message: 'User Not Found',
            type: UserErrorEnum.NOT_FOUND,
            details: 'Not found user by id'
        }
    ];

    constructor(errorParams?: IErrorParams[]) {
        super();
        this.init(errorParams);
    }
}