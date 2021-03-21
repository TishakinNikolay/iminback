import {RequestOptions} from 'https';

export interface IHttpsUtilResponseOptions {
    json?: boolean;
}

export interface IResponseData {
    statusCode: number;
    statusMessage?: string;
    body: any;
}

export interface IResponseErrorData {
    statusCode: number;
    message: string;
}

export interface IHttpsUtilOptions {
    url: string;
    data?: object;
    optionsResponse: IHttpsUtilResponseOptions;
    optionsRequest?: RequestOptions;
}