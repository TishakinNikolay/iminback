import {IError} from '../../../../_shared/interfaces/IError';
import {IErrorParams} from '../../../../_shared/interfaces/IErrorParams';
import {ResponseError} from '../../../../_shared/models/response-error.model';
import {AuthErrorEnum} from '../enums/auth-error.enum';

export class AuthNotValidCodeError extends ResponseError {
    public readonly message = 'Not valid code';
    public readonly statusCode = 409;
    public readonly typeError: string = AuthErrorEnum.NOT_VALID_CODE;
    public errorDetails: IError[] = [];

    constructor(errorParams?: IErrorParams[]) {
        super();
        errorParams = [];
        this.init(errorParams);
    }
}