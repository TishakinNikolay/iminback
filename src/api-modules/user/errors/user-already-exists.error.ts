import {IError} from '../../_shared/interfaces/IError';
import {IErrorParams} from '../../_shared/interfaces/IErrorParams';
import {ResponseError} from '../../_shared/models/response-error.model';
import {UserErrorEnum} from '../enums/user-error.enum';


export class UserAlreadyExistsError extends ResponseError {
    public readonly message = 'User already exists';
    public readonly statusCode = 404;
    public readonly typeError: string = UserErrorEnum.NOT_FOUND;
    public errorDetails: IError[] = [
        {
            message: 'User already exists',
            type: UserErrorEnum.NOT_FOUND,
            details: 'User already exists by phone or nickname'
        }
    ];

    constructor(errorParams?: IErrorParams[]) {
        super();
        this.init(errorParams);
    }
}