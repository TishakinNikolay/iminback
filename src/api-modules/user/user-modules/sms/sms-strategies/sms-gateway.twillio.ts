import * as twilio from 'twilio';
import {InvalidPhoneError} from '../errors/invalid-phone.error';
import {SmsGateway} from './sms-gateway';

export class SmsGatewayTwillio extends SmsGateway {
    private static ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    private static AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    private static SMS_SERIVCE_SID = process.env.TWILIO_SMS_SERVICE_SID;

    private client;

    constructor() {
        super();
        this.client = twilio(SmsGatewayTwillio.ACCOUNT_SID, SmsGatewayTwillio.AUTH_TOKEN);
    }

    sendSMS(phone: string, body: string): Promise<boolean> {
        return this.client.messages
            .create({
                body: body,
                messagingServiceSid: SmsGatewayTwillio.SMS_SERIVCE_SID,
                to: phone
            })
            .then(() => true)
            .catch(() => false);
    }

    async validatePhoneNumber(phone: string): Promise<boolean> {
        try {
            await this.client.lookups.v1.phoneNumbers(phone).fetch();
        } catch (e : any) {
            throw new InvalidPhoneError({phone});
        }
        return true;
    }

}