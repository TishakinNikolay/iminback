import {ResponseError} from '../../_shared/models/response-error.model';
import {UserErrorEnum} from '../enums/user-error.enum';


export class UserAlreadyExistsError extends ResponseError {
    public readonly message = 'User already exists';
    public readonly statusCode = 404;
    public readonly typeError: string = UserErrorEnum.NOT_FOUND;
    public errorDetails: any;

    constructor(details: any) {
        super();
        this.errorDetails = details;
    }
}