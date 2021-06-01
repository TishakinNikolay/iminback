import {InvalidPhoneError} from '../errors/invalid-phone.error';
import {SmsGateway} from './sms-gateway';
import * as Telesign from 'telesignsdk';
export class SmsGatewayTelesign extends SmsGateway {
    private customerId = "D403D5B3-86A0-4DB5-A542-E9A0FF6EB2F1";
    private apiKey = "cC2I9+jSMZtAgNnWwqZK2nkWA/BITN+za7mtCXL+WPN85NYzAcXFqGDEENT5arqHA9BJT4XwxVwSscUxjV7zfQ==";
    private rest_endpoint = "https://rest-api.telesign.com";
    private timeout = 10*1000; // 10 secs

    private client;

    constructor() {
        super();
        this.client = new Telesign( this.customerId,
            this.apiKey,
            this.rest_endpoint,
            this.timeout // optional
            // userAgent
        );
    }

    async validatePhoneNumber(phone: string): Promise<boolean> {
        const accountLifeCycleEvent = "create";
        return new Promise((res, rej) => {
            this.client.score.score((err, responseBody) => {
                console.log(responseBody);
                if(!err) {
                    res(true);
                } else {
                    rej(err);
                }
            }, phone, accountLifeCycleEvent);
        });
    }

    async sendSMS(phone: string, body: string): Promise<boolean> {
        return new Promise((res, rej) => {
            this.client.sms.message((err, responseBody) => {
                console.log(responseBody);
                if(!err) {
                    res(true);
                } else {
                    rej(err);
                }
            }, phone, body, "ARN");
        });
    }

}