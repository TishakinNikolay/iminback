import {GatewayStrategyEnum} from './gateway-strategy.enum';
import {SmsGateway} from './sms-gateway';
import {SmsGatewayTwillio} from './sms-gateway.twillio';

export class SmsGatewayFactory {
    private static smsGatewayStrategies = new Map([[
        GatewayStrategyEnum.TWILIO, SmsGatewayTwillio
    ]]);

    public static getGatewayInstance(): SmsGateway {
        // @ts-ignore
        return new (SmsGatewayFactory.smsGatewayStrategies.get(process.env.SMS_GATEWAY))();
    }
}