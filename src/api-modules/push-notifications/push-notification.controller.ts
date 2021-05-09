import {Body, Controller, Get, Param, Patch, Post, UseGuards} from "@nestjs/common";
import {PushNotificationService} from "./push-notification.service";
import {PushNotificationSendDataRequestDto} from "./models/dto/requests/push-notification-send-data-request.dto";
import {GetUser} from "../_shared/decorators/get-user-request.decorator";
import {User} from "../user/models/user.entity";
import {PushNotificationCreateManyAndSendRequestDto} from "./models/dto/requests/push-notification-create-many-and-send-request.dto";
import {LocalGuard} from "../user/user-modules/auth/guards/local.guard";
import {PushNotificationGetByUserRequestDto} from "./models/dto/requests/push-notification-get-by-user-request.dto";

@Controller('push-notification')
export class PushNotificationController {
    constructor(
        private readonly pushNotificationService: PushNotificationService
    ) {
    }

    @Post('/send-test')
    public async createAndSendTest() {
        // await this.pushNotificationService.createAndSendNotification(
        //     {
        //         receiverId: 2,
        //         parametersTemplate: {title: 'Hi am Title', message: 'Hi am Message'},
        //         notificationTemplateId: 1,
        //         eventId: 1
        //     }, {
        //         parameters: {title: 'Hi am Title', message: 'Hi am Message'},
        //         eventId: 1,
        //         userFindCondition: {id: 2},
        //         ...new PushNotificationSendDataRequestDto()
        //     }
        // )
    }

    @Post('/send-create')
    public async createAndSend(@Body() requestBody: PushNotificationCreateManyAndSendRequestDto) {
        await this.pushNotificationService.createManyAndSendNotification(requestBody)
    }

    @Patch('seen/:id')
    public async seenNotification(@Param('id') id: number) {
        await this.pushNotificationService.setSeen(true, id)
    }

    @Get()
    @UseGuards(LocalGuard)
    public async getNotificationByUser(@GetUser() user: User) {
        await this.pushNotificationService.getNotificationsByUser({
            ...new PushNotificationGetByUserRequestDto(),
            receiverId: user.id
        })
    }
}
