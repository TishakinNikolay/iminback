export class PushNotificationSendDataRequestDto {
    parameters: any
    priority: string = 'high'
    topic: string = 'topic'
    contentAvailable: boolean = true
    eventId: number
}
