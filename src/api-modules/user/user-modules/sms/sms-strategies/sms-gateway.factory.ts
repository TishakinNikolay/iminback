import {GatewayStrategyEnum} from './gateway-strategy.enum';
import {SmsGateway} from './sms-gateway';
import {SmsGatewayTwillio} from './sms-gateway.twillio';
import {SmsGatewayVonage} from './sms-gateway.vonage';

export class SmsGatewayFactory {
    private static smsGatewayStrategies = new Map<GatewayStrategyEnum,any>([
        [GatewayStrategyEnum.TWILIO, SmsGatewayTwillio],
        [GatewayStrategyEnum.VONAGE, SmsGatewayVonage]
    ]);

    public static getGatewayInstance(): SmsGateway {
        // @ts-ignore
        return new (SmsGatewayFactory.smsGatewayStrategies.get(process.env.SMS_GATEWAY))();
    }
}