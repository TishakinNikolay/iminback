export abstract class  SmsGateway {
    public abstract sendSMS(phone: string, body: string): Promise<boolean>;
}
