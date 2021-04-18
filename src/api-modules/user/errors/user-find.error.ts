import {ResponseError} from '../../_shared/models/response-error.model';
import {UserErrorEnum} from '../enums/user-error.enum';

export class UserFindError extends ResponseError {
    public  message = 'User Not Found';
    public  statusCode = 401;
    public  typeError: string = UserErrorEnum.NOT_FOUND;
    public errorDetails: any;

    constructor(details: any) {
        super();
        this.errorDetails = details;
    }
}