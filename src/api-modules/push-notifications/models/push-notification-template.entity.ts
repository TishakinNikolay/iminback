import {BaseColumnModel} from "../../_shared/base/base-column.model";
import {PushNotificationCategoryEnum} from "../enums/push-notification-category.enum";
import {AfterLoad, Column, Entity} from "typeorm";
import {PushNotificationNameEnum} from "../enums/push-notification-name.enum";

@Entity('notification_template')
export class PushNotificationTemplateEntity extends BaseColumnModel {
    @Column({type: 'character varying', nullable: false, length: 350})
    public title: string
    @Column({type: 'character varying', nullable: false, length: 5000})
    public message: string
    @Column({type: 'enum', enum: PushNotificationNameEnum, nullable: false})
    public name: string
    @Column({type: 'enum', enum: PushNotificationCategoryEnum, nullable: false})
    public notificationCategoryEnum: PushNotificationCategoryEnum

    public notificationNameEnum: PushNotificationNameEnum

    @AfterLoad()
    private initAfterLoad() {
        this.notificationNameEnum = PushNotificationNameEnum[this.name]
            ? PushNotificationNameEnum[this.name]
            : PushNotificationNameEnum.CUSTOM_NAME
    }

    public getText(parameters) {
        let title: string = this.title
        let message: string = this.message

        const keys = Object.keys(parameters)

        console.log(parameters)

        for(const i of keys) {
            title = title.replace(`*|${i}|*`,parameters[i])
            message = message.replace(`*|${i}|*`,parameters[i])
        }

        console.log({
            title, message
        })

        return {
            title, message
        }
    }
}
