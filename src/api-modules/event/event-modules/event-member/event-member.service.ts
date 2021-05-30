import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {scalable, scalableBulk} from '../../../_shared/decorators/remap.decorator';
import {ChatService} from '../../../chat/chat.service';
import {PushNotificationService} from '../../../push-notifications/push-notification.service';
import {User} from '../../../user/models/user.entity';
import {EventValidatorService} from '../../event-validator.service';
import {EventService} from '../../event.service';
import {Event} from '../../models/event.entity';
import {StatusEnum} from './enums/status.enum';
import {CantAcceptAllError} from './errors/cant-accept-all.error';
import {NoFreePlacesError} from './errors/no-free-places.error';
import {EventMemberRepository} from './event-member.repository';
import {EventMemberApplyDto} from './models/dto/request/apply/event-member.apply.dto';
import {EventMemberApproveRequestDto} from './models/dto/request/approve/event-member.approve.dto';
import {EventMemberDeclineRequestDto} from './models/dto/request/decline/event-member.decline.dto';
import {EventMemberApplyResponseDto} from './models/dto/response/event-member.apply-response.dto';
import {EventMemberApproveResponseDto} from './models/dto/response/event-member.approve-response.dto';
import {EventMemberDeclineResponseDto} from './models/dto/response/event-member.decline-response.dto';
import {EventMemberResponseDto} from './models/dto/response/event-member.response.dto';
import {EventMember} from './models/event-member.entity';

@Injectable()
export class EventMemberService {
    constructor(
        private readonly eventMemberRepository: EventMemberRepository,
        @Inject(forwardRef(() => EventValidatorService))
        private readonly eventValidatorService: EventValidatorService,
        @Inject(forwardRef(() => EventService))
        private readonly eventService: EventService,
        @Inject(forwardRef(() => ChatService))
        private readonly chatService: ChatService,
        @Inject(forwardRef(() => PushNotificationService))
        private readonly pushNotificationService: PushNotificationService) {
    }

    @scalable(EventMemberApplyResponseDto)
    public async applyMember(eventMemberApply: EventMemberApplyDto): Promise<EventMember> {
        // if there is any approved event with intersected timerange - throws exception
        const targetEvent: Event = await this.eventService.getEventById(eventMemberApply.eventId);
        const approvedMembers = targetEvent.eventMembers ? targetEvent.eventMembers.filter(member => member.status === StatusEnum.APPROVED) : [];
        if (targetEvent.totalOfPersons === approvedMembers.length) {
            throw new NoFreePlacesError(null);
        }
        await this.eventValidatorService.validateSelfEventApplication(eventMemberApply.userId, eventMemberApply.eventId);
        await this.eventValidatorService.validateApplicationEventTime(eventMemberApply.userId, targetEvent.startTime, targetEvent.endTime);
        const eventMember: EventMember = Object.assign(new EventMember(), eventMemberApply);
        eventMember.status = StatusEnum.APPLIED;
        eventMember.applicationDate = new Date();
        const result = await this.eventMemberRepository.applyMemberToEvent(eventMember);
        const appliedUser = await User.findOne({id: eventMemberApply.userId});
        const notification = await this.pushNotificationService
            .getNotificationInstanceDefault(
                targetEvent.owner.id,
                {
                    title: 'Новый запрос',
                    message: `${appliedUser.firstName + appliedUser.lastName} отправил запрос на участие в событии`,
                    data: {
                        notification_type: 'NEW_APPLICATION',
                        eventId: targetEvent.id
                    }
                },
                'NEW_APPLICATION',
                targetEvent.id
            );
        await this.pushNotificationService.createAndSendNotification(notification);
        return result;
    }

    public async deleteEventMemberApplication(eventMemberDto: EventMemberApplyDto): Promise<void> {
        const eventMember: EventMember =  await EventMember.find({userId : eventMemberDto.userId,eventId : eventMemberDto.eventId})[0];
        await this.eventMemberRepository.deleteEventMemberApplitacion(eventMember);
        if(eventMember.status = StatusEnum.APPLIED) {
            this.sendNotificationOnApplicationRefuse(eventMemberDto);
        } else {
            this.sendNotificationOnMembershipRefuse(eventMemberDto);
        }
    }

    @scalableBulk(EventMemberResponseDto)
    public async getAppliedMembers(eventId: number): Promise<EventMember[]> {
        return this.eventMemberRepository.getAppliedMembers(eventId);
    }

    @scalableBulk(EventMemberResponseDto)
    public async getApprovedMembers(eventId: number): Promise<EventMember[]> {
        return this.eventMemberRepository.getApprovedMembers(eventId);
    }

    @scalable(EventMemberApproveResponseDto)
    public async approveEventMember(approveRequest: EventMemberApproveRequestDto): Promise<EventMember> {
        const {startTime, endTime} = await this.eventService.getEventById(approveRequest.eventId);
        await this.eventMemberRepository.flushCollisedApplications(startTime, endTime, approveRequest.userId);

        const partialEventMember: EventMember = Object.assign(new EventMember(), approveRequest);
        partialEventMember.status = StatusEnum.APPROVED;
        partialEventMember.approvalDate = new Date();
        const approvedMembers = await this.getApprovedMembers(partialEventMember.eventId);
        const approvedUser = await User.findOne({id: partialEventMember.userId});
        await this.eventMemberRepository.approveEventMember(partialEventMember);
        await this.chatService.addChatMemberOnApprove(approveRequest.userId, approveRequest.eventId);
        this.sendNotificationOnApprove(approvedUser, approvedMembers, partialEventMember.eventId);
        return partialEventMember;
    }

    @scalable(EventMemberDeclineResponseDto)
    public async declineEventMember(declineRequest: EventMemberDeclineRequestDto): Promise<EventMember> {
        const partialEventMember: EventMember = Object.assign(new EventMember(), declineRequest);
        const existingMember = await EventMember.findOne(partialEventMember);
        if (existingMember.status = StatusEnum.APPROVED) {
            await this.chatService.removeChatMemberOnDecline(existingMember.userId, existingMember.eventId);
        }
        this.sendNotificationOnDecline(existingMember);
        partialEventMember.status = StatusEnum.DECLINED;
        partialEventMember.declineDate = new Date();
        await this.eventMemberRepository.declineEventMember(partialEventMember);
        return partialEventMember;
    }

    @scalableBulk(EventMemberApproveResponseDto)
    public async acceptAll(eventId: number): Promise<EventMember[]> {
        const targetEvent: Event = await this.eventService.getEventById(eventId);
        const appliedMembers = targetEvent.eventMembers ? targetEvent.eventMembers.filter(member => member.status === StatusEnum.APPLIED) : [];
        const approvedMembers = targetEvent.eventMembers ? targetEvent.eventMembers.filter(member => member.status === StatusEnum.APPROVED) : [];
        if (targetEvent.totalOfPersons - approvedMembers.length < appliedMembers.length) {
            throw new CantAcceptAllError(null);
        }
        appliedMembers.forEach(member => member.status = StatusEnum.APPROVED);
        return Promise.all(appliedMembers
            .map(member => {
                return this.eventMemberRepository.flushCollisedApplications(targetEvent.startTime, targetEvent.endTime, member.userId)
                    .then(() => this.eventMemberRepository.approveEventMember(member));
            }));
    }

    public async sendNotificationOnApprove(approvedUser, approvedUsers, eventId) {
        const approvedUserNotification = await this
            .pushNotificationService
            .getNotificationInstanceDefault(
                approvedUser.id,
                {
                    title: 'Запрос принят',
                    message: 'Поздравляем! Ваш запрос на участие принят!',
                    data: {
                        notification_type: 'APPLICATION_APPROVED',
                        eventId: eventId
                    }
                },
                'APPLICATION_APPROVED',
                eventId);
        const pushService = this.pushNotificationService;
        await pushService.createAndSendNotification(approvedUserNotification);
        for (const member of approvedUsers) {
            const result = (await pushService
                .getNotificationInstanceDefault(
                    member.userId,
                    {
                        title: 'Новый участник события',
                        message: `${approvedUser.firstName + approvedUser.lastName} присоединился к событию`,
                        data: {
                            notification_type: 'NEW_EVENT_MEMBER',
                            eventId: eventId
                        }
                    },
                    'NEW_EVENT_MEMBER',
                    eventId));
            pushService.createAndSendNotification(result);
        }
    }

    public async sendNotificationOnDecline(existingEventMember) {
        if (existingEventMember.status = StatusEnum.APPLIED) {
            const approvedUserNotification = await this
                .pushNotificationService
                .getNotificationInstanceDefault(
                    existingEventMember.userId,
                    {
                        title: 'Запрос отклонен',
                        message: 'К сожалению, ваш запрос был отклонен',
                        data: {
                            notification_type: 'APPLIED_MEMBER_BEEN_DECLINED',
                            eventId: existingEventMember.eventId
                        }
                    },
                    'APPLIED_MEMBER_BEEN_DECLINED',
                    existingEventMember.eventId);
            this.pushNotificationService.createAndSendNotification(approvedUserNotification);
        } else {
            const approvedUserNotification = await this
                .pushNotificationService
                .getNotificationInstanceDefault(
                    existingEventMember.userId,
                    {
                        title: 'Участие отменено',
                        message: 'К сожалению, вы больше не являетесь участником события',
                        data: {
                            notification_type: 'APPROVED_MEMBER_DECLINED',
                            eventId: existingEventMember.eventId
                        }
                    },
                    'APPROVED_MEMBER_DECLINED',
                    existingEventMember.eventId);
            const pushService = this.pushNotificationService;
            await pushService.createAndSendNotification(approvedUserNotification);
            const approvedMembers = await this.getApprovedMembers(existingEventMember.eventId);
            const declinedUser = await User.findOne({id: existingEventMember.userId});
            for (const member of approvedMembers) {
                const result = (await this.pushNotificationService
                    .getNotificationInstanceDefault(
                        member.userId,
                        {
                            title: 'Участие отменено',
                            message: `${declinedUser.firstName + declinedUser.lastName} больше не является участником события`,
                            data: {
                                notification_type: 'APPROVED_MEMBER_DECLINED_FOR_PARTICIPANTS',
                                eventId: existingEventMember.eventId
                            }
                        },
                        'APPROVED_MEMBER_DECLINED_FOR_PARTICIPANTS',
                        existingEventMember.eventId));
                pushService.createAndSendNotification(result);
            }
        }
    }

    public async sendNotificationOnMembershipRefuse({userId, eventId}) {
        const refusedUser = await User.findOne({id: userId});
        const event = await Event.findOne({id: eventId}, {relations: ['owner']});
        const approvedMembers = await this.getApprovedMembers(eventId);
        const ownerNotification = await this
            .pushNotificationService
            .getNotificationInstanceDefault(
                event.owner.id,
                {
                    title: 'Участие отменено',
                    message: `${refusedUser.firstName + ' ' + refusedUser.lastName} отказался от участия в событии`,
                    data: {
                        notification_type: 'APPROVED_MEMBER_REFUSE',
                        eventId: eventId
                    }
                },
                'APPROVED_MEMBER_REFUSE',
                eventId);
        await this.pushNotificationService.createAndSendNotification(ownerNotification);
        for (const member of approvedMembers) {
            const result = (await this.pushNotificationService
                .getNotificationInstanceDefault(
                    member.userId,
                    {
                        title: 'Участие отменено',
                        message: `${refusedUser.firstName + refusedUser.lastName} больше не является участником события`,
                        data: {
                            notification_type: 'APPROVED_MEMBER_REFUSE',
                            eventId: eventId
                        }
                    },
                    'APPROVED_MEMBER_REFUSE',
                    eventId));
            this.pushNotificationService.createAndSendNotification(result);
        }
    }
    public async sendNotificationOnApplicationRefuse({userId, eventId}) {
        const refusedUser = await User.findOne({id: userId});
        const event = await Event.findOne({id: eventId}, {relations: ['owner']});
        const ownerNotification = await this
            .pushNotificationService
            .getNotificationInstanceDefault(
                event.owner.id,
                {
                    title: 'Запрос отменен',
                    message: `${refusedUser.firstName + ' ' + refusedUser.lastName} отказался от участия в событии`,
                    data: {
                        notification_type: 'APPLICATION_REFUSE',
                        eventId: eventId
                    }
                },
                'APPLICATION_REFUSE',
                eventId);
        await this.pushNotificationService.createAndSendNotification(ownerNotification);
    }

}