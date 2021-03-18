import {HttpsUtils} from '../../../../utils/https';
import {IResponseData} from '../../../../utils/https/interfaces/IHttpsUtils';
import {IConfigApi, IConfigAuth} from '../../interfaces/IConfig';
import {NotFoundException} from '@nestjs/common';

export class ParentApi {
    private readonly config: IConfigApi;
    private readonly httpsManager: HttpsUtils;
    protected baseUrl: string;

    constructor(config: IConfigApi, url: string) {
        this.config = config;
        this.httpsManager = new HttpsUtils();
        this.baseUrl = this.config.baseUrl + url;
    }

    protected async post(url: string = '', data: object, json: boolean = true): Promise<IResponseData> {
        url = this.getUrl(url);

        const result = await this.httpsManager.post(url, data, {json});

        if (this.checkOnErrors(result)) {
            if (result.body.errors) {
                throw result.body.errors;
            } else {
                throw result.body;
            }
        }

        return result;
    }

    protected async patch(url: string = '', data: object): Promise<IResponseData> {
        url = this.getUrl(url);

        const result = await this.httpsManager.patch(url, data, {json: true});

        if (this.checkOnErrors(result)) {
            if (result.body.errors) {
                throw result.body.errors;
            } else {
                throw result.body;
            }
        }

        return result;
    }

    protected async delete(url: string = '', data: object, json: boolean = true): Promise<boolean> {
        url = this.getUrl(url);

        const result = await this.httpsManager.delete(url, data, {json});

        if (this.checkOnErrors(result)) {
            if (result.body.errors) {
                throw result.body.errors;
            } else {
                throw result.body;
            }
        }

        return true;
    }

    protected async get(url: string = ''): Promise<IResponseData> {
        url = this.getUrl(url);

        const result = await this.httpsManager.get(url, {json: true}, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (this.checkOnErrors(result)) {
            console.log(result)
            throw new NotFoundException(result.body.meta.error);
        }

        return result;
    }

    private checkOnErrors(res: IResponseData): boolean {
        if (res.statusCode === 200 && !res.body.meta.error) {
            return false;
        }

        let body;
        try {
            body = JSON.parse(res.body);
        } catch (e) {
            body = res.body;
        }

        return body.meta.error;
    }

    private getUrl(url: string) {
        if (url === '') {
            url = this.baseUrl;
        } else { url = this.baseUrl + url; }

        return url + '&key=' + this.config.auth.key;
    }
}
