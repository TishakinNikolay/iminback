import {ResponseError} from '../../../../_shared/models/response-error.model';
import {SmsErrorEnum} from '../enums/sms-error.enum';

export class InvalidPhoneError extends ResponseError {
    public readonly message = 'Invalid Phone';
    public readonly statusCode = 400;
    public readonly typeError: string = SmsErrorEnum.INVALID_PHONE;
    public errorDetails: any;

    constructor(details: any) {
        super();
        this.errorDetails = details;
    }
}