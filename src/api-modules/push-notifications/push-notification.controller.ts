import {Controller, Get, Param, Patch, Post} from "@nestjs/common";
import {PushNotificationService} from "./push-notification.service";
import {PushNotificationSendDataRequestDto} from "./models/dto/requests/push-notification-send-data-request.dto";
import {GetUser} from "../_shared/decorators/get-user-request.decorator";
import {User} from "../user/models/user.entity";

@Controller('push-notification')
export class PushNotificationController {
    constructor(
        private readonly pushNotificationService: PushNotificationService
    ) {
    }

    @Post('/send-test')
    public async createAndSendTest() {
        await this.pushNotificationService.createAndSendNotification(
            {
                receiverId: 2,
                parametersTemplate: {title: 'Hi am Title', message: 'Hi am Message'},
                notificationTemplateId: 1,
                eventId: 1
            }, {
                parameters: {title: 'Hi am Title', message: 'Hi am Message'},
                eventId: 1,
                userFindCondition: {id: 2},
                ...new PushNotificationSendDataRequestDto()
            }
        )
    }

    @Patch('seen/:id')
    public async seenNotification(@Param('id') id: number) {
        await this.pushNotificationService.setSeen(true, id)
    }

    @Get()
    public async getNotificationByUser(@GetUser() user: User) {
     // TODO: добавить логику как для авторизированного так и нет
    }
}
