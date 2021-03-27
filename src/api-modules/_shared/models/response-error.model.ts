import {IError} from '../interfaces/IError';
import {IErrorParams} from '../interfaces/IErrorParams';

export abstract class ResponseError {
    abstract statusCode: number;
    abstract message: string;
    abstract typeError: string;
    abstract errorDetails: IError[];

    setErrorDetails(errorParams?: IErrorParams[]) {
        this.errorDetails
            .filter(i => errorParams.some(e => e.type === i.type))
            .map((i) => {
                const details = errorParams.find(e => e.type === i.type).object;
                if (details) {
                    i.details = details;
                    return i;
                } else {
                    return i;
                }
            });
    }

    init(errorParams?: IErrorParams[]) {
        this.setErrorDetails(errorParams);
    }
}