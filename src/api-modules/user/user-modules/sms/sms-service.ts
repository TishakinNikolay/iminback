import {Injectable} from '@nestjs/common';
import {SmsGatewayFactory} from './sms-strategies/sms-gateway.factory';

@Injectable()
export class SmsService {
    private smsGateway;
    constructor() {
        this.smsGateway = SmsGatewayFactory.getGatewayInstance();
    }

    public sendSMS(phone : string, body : string) : Promise<boolean> {
        return this.smsGateway.sendSMS(phone, body);
    }
}