import {FindConditions} from "typeorm";
import {User} from "../../../../user/models/user.entity";

export class PushNotificationSendDataRequestDto {
    parameters: any
    userFindCondition: FindConditions<User>
    priority: string = 'high'
    topic: string = 'topic'
    contentAvailable: boolean = true
    eventId: number
}
