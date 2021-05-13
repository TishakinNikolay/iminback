import * as Vonage from '@vonage/server-sdk';
import {InvalidPhoneError} from '../errors/invalid-phone.error';
import {SmsGateway} from './sms-gateway';
export class SmsGatewayVonage extends SmsGateway {
    private static API_KEY = process.env.VONAGE_API_KEY;
    private static API_SECRET = process.env.VONAGE_API_SECRET;

    private client;

    constructor() {
        super();
        // @ts-ignore
        this.client =  new Vonage({
            apiKey: SmsGatewayVonage.API_KEY,
            apiSecret: SmsGatewayVonage.API_SECRET
        });
    }

    sendSMS(phone: string, body: string): Promise<boolean> {
        return this.vonageSendSMSPromisify(phone,body)
            .then(() => true)
            .catch(() => false);
    }

    async validatePhoneNumber(phone: string): Promise<boolean> {
        try {

        } catch (e : any) {
            throw new InvalidPhoneError({phone});
        }
        return true;
    }

    private async vonageSendSMSPromisify(number, msg) {
        const from = 'I`min'
        return new Promise<any>((res,rej) => {
            this.client.message.sendSms(from, number, msg, (err, responseData) => {
                if (err) {
                    rej(err);
                } else {
                    if(responseData.messages[0]['status'] === "0") {
                        console.log("Message sent successfully.");
                        res(true);
                    } else {
                        console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                        rej(responseData.messages[0])
                    }
                }
            })
        });
    }

}