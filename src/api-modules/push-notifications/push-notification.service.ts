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
import {PushNotificationCreateManyAndSendRequestDto} from "./models/dto/requests/push-notification-create-many-and-send-request.dto";
import {PushNotificationCreateSendRequestDto} from "./models/dto/requests/push-notification-create-send-request.dto";
import {Event} from "../event/models/event.entity";

@Injectable()
export class PushNotificationService {
    constructor(
        @Inject('GENERAL_OPTIONS')
        private options: IPushNotificationConfig
    ) {}

    public async send(notificationFindCondition: FindConditions<PushNotificationTemplateEntity>, data: PushNotificationSendDataRequestDto, userCondition: FindConditions<User>) {
        const notificationTemplate = await PushNotificationTemplateEntity.findOne(notificationFindCondition)

        if (!notificationTemplate) {
            throw new NotificationTemplateNotFoundError({
                notificationFindCondition
            })
        }

        console.log(notificationTemplate)
        console.log(data.parameters)

        const {title, message} = notificationTemplate.getText(data.parameters)

        delete data.parameters

        const tokens = (await User.find({
            select: ['pushNotificationToken'],
            where: {
                ...userCondition,
                pushNotificationToken: Not(IsNull())
            }
        })).map(i => i.pushNotificationToken);

        const sender = new PushNotifications(this.options);

        const event = await Event.findOne(data.eventId, {relations: ['image']})

        return await sender.send(tokens, {...data, title, body: message, custom: data.parameters, icon: event!.image.uri})
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

    public async createAndSendNotification(body: PushNotificationCreateSendRequestDto) {
        await this.createNotification(body.notification)
        console.log(await this.send({
            id: body.notification.notificationTemplateId
            }, body.sendOptions, body.filter.userFindCondition))
    }

    public async createManyAndSendNotification(body: PushNotificationCreateManyAndSendRequestDto) {
        body.sendOptions = Object.assign(body.notification, {parameters: body.notification.parametersTemplate}, body.sendOptions)

        await this.createManyNotifications({notification: body.notification, userFindCondition: body.filter.userFindCondition})
        console.log(await this.send({id: body.notification.notificationTemplateId}, body.sendOptions, body.filter.userFindCondition))
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

    public async getNotificationInstanceDefault(userId, jsonParams, templateName, eventId) {
        const notificationRequest = new PushNotificationCreateSendRequestDto();
        const notificationBody = new PushNotificationCreateRequestDto();
        const notificationParams = new PushNotificationSendDataRequestDto();
        notificationBody.eventId = eventId;
        notificationBody.notificationTemplateId = (await PushNotificationTemplateEntity.find( {
            name : templateName
        }))[0].id;
        notificationBody.parametersTemplate = jsonParams;
        notificationRequest.sendOptions = notificationParams;
        const filter = {
            "userFindCondition": {
                "id": userId
            }
        };
        notificationRequest.filter = filter;
        return notificationRequest;
    }
}
