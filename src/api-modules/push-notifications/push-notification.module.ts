import {DynamicModule, Module} from "@nestjs/common";
import {PushNotificationService} from "./push-notification.service";
import {IPushNotificationConfig} from "./interfaces/push-notification-config.interface";
import {PushNotificationController} from "./push-notification.controller";

const options: IPushNotificationConfig = {
    gcm: {
        id: process.env.PUSH_NOTIFICATION_GCM_KEY,
        phonegap: false
    }
}

@Module({controllers: [PushNotificationController],
    providers: [
        {
            provide: 'GENERAL_OPTIONS',
            useValue: options
        },
        PushNotificationService
    ],
    exports: [PushNotificationService]

})
export class PushNotificationModule {}
