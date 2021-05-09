import {FindConditions} from "typeorm";
import {User} from "../../../../user/models/user.entity";

export class PushNotificationFilterRequestDto {
    public userFindCondition: FindConditions<User>
}
