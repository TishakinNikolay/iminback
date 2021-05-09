import {BaseColumnModel} from "../../_shared/base/base-column.model";
import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {PushNotificationTemplateEntity} from "./push-notification-template.entity";

@Entity('notification')
export class PushNotificationEntity extends BaseColumnModel {
    @Column({type: 'integer', nullable: false})
    public receiverId: number
    @Column({type: 'integer', nullable: true})
    public eventId: number
    @Column({type: 'jsonb', nullable: false})
    public parametersTemplate: any // json
    @Column({type: 'integer', nullable: false})
    public notificationTemplateId: number
    @Column({type: 'boolean', nullable: false, default: false})
    public isSeen: boolean

    @ManyToOne(type => PushNotificationTemplateEntity)
    @JoinColumn({name: 'notificationTemplateId', referencedColumnName: 'id'})
    public notificationTemplate: PushNotificationTemplateEntity
}
