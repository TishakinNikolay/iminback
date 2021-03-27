import {ErrorsMapEnum} from '../../enums/erros/errors-map.enum';
import {IError} from '../../interfaces/IError';
import {IErrorParams} from '../../interfaces/IErrorParams';
import {ResponseError} from '../../models/response-error.model';

export class ErrorMapSearchModel extends ResponseError {
    public readonly message = 'Results Not Found';
    public readonly statusCode = 404;
    public readonly typeError: string = ErrorsMapEnum.SEARCH_NOT_FOUND;
    public errorDetails: IError[] = [
        {
            message: 'Results Not Found',
            type: ErrorsMapEnum.SEARCH_NOT_FOUND,
            details: 'Not found address'
        }
    ];

    constructor(errorParams?: IErrorParams[]) {
        super();
        this.init(errorParams);
    }
}