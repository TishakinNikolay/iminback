import {FindConditions} from "typeorm";
import {User} from "../../../../user/models/user.entity";
import {PushNotificationCreateRequestDto} from "./push-notification-create-request.dto";

export class PushNotificationCreateManyRequestDto {
    public userFindCondition?: FindConditions<User>
    public notification: PushNotificationCreateRequestDto
}
