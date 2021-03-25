import {IError} from '../../interfaces/IError';
import {IResponseError} from '../../interfaces/IResponseError';

export class ErrorMapSearchModel implements IResponseError {
    public message = 'Results Not Found';
    public statusCode = 404;

    constructor(
        public errorDetails: IError[] = []
    ) {
    }
}