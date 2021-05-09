import {Inject, Injectable} from "@nestjs/common";
import {IPushNotificationConfig} from "./interfaces/push-notification-config.interface";
import {PushNotificationSendDataRequestDto} from "./models/dto/requests/push-notification-send-data-request.dto";
import {User} from "../user/models/user.entity";
import {Not, IsNull, FindOneOptions, FindConditions} from "typeorm";
import * as PushNotifications from 'node-pushnotifications'
import {PushNotificationEntity} from "./models/push-notification.entity";
import {PushNotificationGetAllRequestDto} from "./models/dto/requests/push-notification-get-all-request.dto";
import {NotificationNotFoundError} from "./errors/notification-not-found.error";
import {PushNotificationTemplateEntity} from "./models/push-notification-template.entity";
import {NotificationTemplateNotFoundError} from "./errors/notification-template-not-found.error";
import {PushNotificationCreateRequestDto} from "./models/dto/requests/push-notification-create-request.dto";
import {PushNotificationGetByUserRequestDto} from "./models/dto/requests/push-notification-get-by-user-request.dto";
import {PushNotificationCreateManyRequestDto} from "./models/dto/requests/push-notification-create-many-request.dto";

@Injectable()
export class PushNotificationService {
    constructor(
        @Inject('GENERAL_OPTIONS')
        private options: IPushNotificationConfig
    ) {}

    public async send(notificationFindCondition: FindConditions<PushNotificationTemplateEntity>, data: PushNotificationSendDataRequestDto) {
        const notificationTemplate = await PushNotificationTemplateEntity.findOne(notificationFindCondition)

        if (!notificationTemplate) {
            throw new NotificationTemplateNotFoundError({
                notificationFindCondition
            })
        }

        const {title, message} = notificationTemplate.getText(data.parameters)

        delete data.parameters

        const tokens = (await User.find({
            select: ['pushNotificationToken'],
            where: {
                ...data.userFindCondition,
                pushNotificationToken: Not(IsNull())
            }
        })).map(i => i.pushNotificationToken);

        const sender = new PushNotifications(this.options);

        return await sender.send(tokens, {...data, title, body: message})
    }

    public async createNotification(_newNotification: PushNotificationCreateRequestDto) {
        const notification: PushNotificationEntity = Object.assign( new PushNotificationEntity(), _newNotification)
        return await notification.save()
    }

    public async createManyNotifications(_newNotification: PushNotificationCreateManyRequestDto) {
        const newNotifications: PushNotificationEntity[] = []

        const users = (await User.find({
            select: ['id','pushNotificationToken'],
            where: {
                ..._newNotification.userFindCondition,
                pushNotificationToken: Not(IsNull())
            }
        }));

        for (const user of users) {
            newNotifications.push(Object.assign(
                new PushNotificationEntity(),
                {..._newNotification.notification, receiverId: user.id},
                ))
        }

        await PushNotificationEntity.save(newNotifications)
    }

    public async createAndSendNotification(_newNotification: PushNotificationCreateRequestDto, data: PushNotificationSendDataRequestDto) {
        await this.createNotification(_newNotification)
        console.log(await this.send({
            id: _newNotification.notificationTemplateId
            }, data))
    }

    public async setSeen(seen: boolean, notificationId: number) {
        const notification = await PushNotificationEntity.findOne(notificationId)

        if (!notification) {
            throw new NotificationNotFoundError({
                notificationId
            })
        }

        notification.isSeen = seen
        await notification.save()
    }

    public async getNotifications(filter: PushNotificationGetAllRequestDto) {
        const {perPage, page} = filter

        return await PushNotificationEntity.find({
            take: perPage,
            skip: (page > 0 ? Number(page) - 1 : 0) * Number(perPage),
        })
    }

    public async getNotificationsByUser(filter: PushNotificationGetByUserRequestDto) {
        const {perPage, page, receiverId} = filter

        return await PushNotificationEntity.find({
            where: {
              receiverId
            },
            take: perPage,
            skip: (page > 0 ? Number(page) - 1 : 0) * Number(perPage),
        })
    }
}
