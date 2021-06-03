export class PushNotificationCreateRequestDto {
    public receiverId?: number
    public parametersTemplate: any
    public customParameters: any
    public notificationTemplateId: number
    public eventId?: number
}
