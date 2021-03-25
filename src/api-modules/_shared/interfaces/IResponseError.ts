import {IError} from './IError';

export interface IResponseError {
    statusCode: number;
    message: string;
    errorDetails: IError[];
}