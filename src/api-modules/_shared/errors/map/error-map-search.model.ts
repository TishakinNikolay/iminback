import {ErrorsMapEnum} from '../../enums/erros/errors-map.enum';
import {ResponseError} from '../../models/response-error.model';

export class ErrorMapSearchModel extends ResponseError {
    public readonly message = 'Results Not Found';
    public readonly statusCode = 404;
    public readonly typeError: string = ErrorsMapEnum.SEARCH_NOT_FOUND;
    public errorDetails: any;

    constructor(details: any) {
        super();
        this.errorDetails = details;
    }
}