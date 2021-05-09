import {PushNotificationSendDataRequestDto} from "./push-notification-send-data-request.dto";
import {PushNotificationCreateManyRequestDto} from "./push-notification-create-many-request.dto";
import {FindConditions} from "typeorm";
import {User} from "../../../../user/models/user.entity";
import {PushNotificationCreateRequestDto} from "./push-notification-create-request.dto";
import {PushNotificationFilterRequestDto} from "./push-notification-filter-request.dto";

export class PushNotificationCreateManyAndSendRequestDto {
    public filter: PushNotificationFilterRequestDto
    public sendOptions: PushNotificationSendDataRequestDto
    public notification: PushNotificationCreateRequestDto
}

export class PushNotificationCreate {

}
