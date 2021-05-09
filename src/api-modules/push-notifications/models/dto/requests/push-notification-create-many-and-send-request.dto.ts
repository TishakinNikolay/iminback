import {PushNotificationSendDataRequestDto} from "./push-notification-send-data-request.dto";
import {PushNotificationCreateManyRequestDto} from "./push-notification-create-many-request.dto";
import {FindConditions} from "typeorm";
import {User} from "../../../../user/models/user.entity";
import {PushNotificationCreateRequestDto} from "./push-notification-create-request.dto";

export class PushNotificationCreateManyAndSendRequestDto {
    public userFindCondition: FindConditions<User>
    public sendOptions: PushNotificationSendDataRequestDto
    public notification: PushNotificationCreateRequestDto
}
