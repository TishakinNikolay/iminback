import {PushNotificationCreateRequestDto} from "./push-notification-create-request.dto";
import {PushNotificationSendDataRequestDto} from "./push-notification-send-data-request.dto";
import {PushNotificationFilterRequestDto} from "./push-notification-filter-request.dto";

export class PushNotificationCreateSendRequestDto {
    notification: PushNotificationCreateRequestDto
    sendOptions: PushNotificationSendDataRequestDto
    filter: PushNotificationFilterRequestDto
}
