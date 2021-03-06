import {GatewayStrategyEnum} from './gateway-strategy.enum';
import {SmsGateway} from './sms-gateway';
import {SmsGatewayTelesign} from './sms-gateway.telesign';
import {SmsGatewayTwillio} from './sms-gateway.twillio';
import {SmsGatewayVonage} from './sms-gateway.vonage';

export class SmsGatewayFactory {
    private static smsGatewayStrategies = new Map<GatewayStrategyEnum,any>([
        [GatewayStrategyEnum.TWILIO, SmsGatewayTwillio],
        [GatewayStrategyEnum.VONAGE, SmsGatewayVonage],
        [GatewayStrategyEnum.TELESIGN, SmsGatewayTelesign]

    ]);

    public static getGatewayInstance(): SmsGateway {
        // @ts-ignore
        return new (SmsGatewayFactory.smsGatewayStrategies.get(process.env.SMS_GATEWAY))();
    }
}