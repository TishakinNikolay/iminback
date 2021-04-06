import {ClientRequest} from 'http';
import * as https from 'https';
import {RequestOptions} from 'https';
import * as _ from 'lodash';
import {URL} from 'url';
import {IHttpsUtilResponseOptions, IResponseData} from './interfaces/IHttpsUtils';

export class HttpsUtils {
    public async get(url: string, optionsResponse: IHttpsUtilResponseOptions, optionsRequest: RequestOptions = {}): Promise<IResponseData> {
        return new Promise(async (resolve, reject) => {
            const body: Uint8Array[] = [];
            const urlProp: URL = new URL(url);
            let statusCode: number | undefined;
            let statusMessage: string | undefined;

            const req: ClientRequest = https.request(urlProp, optionsRequest, (res) => {
                statusCode = res.statusCode;
                statusMessage = res.statusMessage;

                res.on('data', (chunk) => body.push(chunk));
                res.on('error', (_error) => {
                    return reject({
                        statusCode: statusCode,
                        body: undefined,
                        isError: true,
                        error: _error
                    });
                });
                res.on('end', () => {
                    const data = Buffer.concat(body).toString();

                    resolve({
                        statusCode: statusCode,
                        statusMessage: statusMessage,
                        body: this.getEditedData(data, optionsResponse)
                    });
                });
            });

            req.on('error', (e) => {
                reject({
                    statusCode: statusCode,
                    body: undefined
                });
            });

            req.end();
        });
    }

    public async post(url: string, data: object, optionsResponse: IHttpsUtilResponseOptions, optionsRequest: RequestOptions = {}): Promise<IResponseData> {
        optionsRequest.method = 'POST';
        return await this.mutationMethod(url, data, optionsResponse, optionsRequest);
    }

    public async delete(url: string, data: object = {}, optionsResponse: IHttpsUtilResponseOptions, optionsRequest: RequestOptions = {}): Promise<IResponseData> {
        optionsRequest.method = 'DELETE';
        return await this.mutationMethod(url, data, optionsResponse, optionsRequest);
    }

    public async patch(url: string, data: object = {}, optionsResponse: IHttpsUtilResponseOptions, optionsRequest: RequestOptions = {}): Promise<IResponseData> {
        optionsRequest.method = 'PATCH';
        return await this.mutationMethod(url, data, optionsResponse, optionsRequest);
    }

    private async mutationMethod(url: string, data: object, optionsResponse: IHttpsUtilResponseOptions, optionsRequest: RequestOptions = {}): Promise<IResponseData> {
        return new Promise(async (resolve, reject) => {
            const body: Uint8Array[] = [];
            const urlProp: URL = new URL(url);
            let statusCode: number | undefined;
            let statusMessage: string | undefined;

            const dataJson = JSON.stringify(data);

            if (!optionsRequest.headers && !_.isEmpty(data)) {
                optionsRequest.headers = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Content-Length': dataJson.length
                };
            } else if (!optionsRequest.headers) {
                optionsRequest.headers = {
                    'Content-Type': 'application/json'
                };
            } else if (optionsRequest.headers && _.isEmpty(data)) {
                optionsRequest.headers['Content-Type'] = 'application/json';
            } else if (optionsRequest.headers && !_.isEmpty(data)) {
                optionsRequest.headers['Content-Type'] = 'application/json';
                optionsRequest.headers.Accept = 'application/json';
                optionsRequest.headers['Content-Length'] = dataJson.length;
            }

            const req: ClientRequest = https.request(urlProp, optionsRequest, (res) => {
                statusCode = res.statusCode;
                statusMessage = res.statusMessage;

                res.on('data', (chunk) => body.push(chunk));
                res.on('end', () => {
                    let result: any = Buffer.concat(body).toString();

                    result = this.getEditedData(result, optionsResponse);

                    resolve({
                        statusCode: statusCode,
                        statusMessage,
                        body: result
                    });
                });
                res.on('error', (_error) => {
                    reject({
                        statusCode: statusCode,
                        body: _error
                    });
                });
            });

            req.on('error', (_error) => {
                reject({
                    statusCode: statusCode,
                    body: _error
                });
            });

            if (!_.isEmpty(data)) {
                req.write(dataJson);
            }

            req.end();
        });
    }

    private getEditedData(data: string, optionsResponse: IHttpsUtilResponseOptions): any {
        if (optionsResponse.json) {
            return JSON.parse(data);
        } else {
            return data;
        }
    }
}
