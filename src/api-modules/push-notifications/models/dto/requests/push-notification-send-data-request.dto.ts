export class PushNotificationSendDataRequestDto {
    parameters: any
    priority: string = 'normal'
    topic: string = 'topic'
    contentAvailable: boolean = true
    eventId: number
}
