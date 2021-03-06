import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {scalable, scalableBulk} from '../_shared/decorators/remap.decorator';
import {ChatService} from '../chat/chat.service';
import {PushNotificationService} from '../push-notifications/push-notification.service';
import {EventNotFoundError} from './errors/event-not-found.error';
import {EventLocationService} from './event-modules/event-location/event-location.service';
import {StatusEnum} from './event-modules/event-member/enums/status.enum';
import {CantAcceptAllError} from './event-modules/event-member/errors/cant-accept-all.error';
import {EventMemberService} from './event-modules/event-member/event-member.service';
import {EventValidatorService} from './event-validator.service';
import {CreateEventDto} from './models/dto/request/create/create-event.dto';
import {EventOwnerDto} from './models/dto/request/event-owner.dto';
import {FeedRequest} from './models/dto/request/feed/feed-request.dto';
import {HistoryEventsRequest} from './models/dto/request/history/history-event-request.dto';
import {CreatedEventsRequest} from './models/dto/request/owner-events/created-events-request.dto';
import {UpcomingEventsRequest} from './models/dto/request/upcoming/upcoming-events-request.dto';
import {UpdateEventDto} from './models/dto/request/update/update-event.dto';
import {VisitedEventsRequest} from './models/dto/request/visited/visited-events-request.dto';
import {ResponseEventDto} from './models/dto/response/response-event.dto';
import {Event} from './models/event.entity';
import {EventRepository} from './repository/event.repository';

@Injectable()
export class EventService {
    constructor(
        private readonly eventRepository: EventRepository,
        private readonly eventMemberService: EventMemberService,
        private readonly eventValidatorSerivce: EventValidatorService,
        private readonly eventLocationService: EventLocationService,
        private readonly chatService: ChatService,
        @Inject(forwardRef(() => PushNotificationService))
        private readonly pushNotificationService: PushNotificationService
    ) {
    }

    @scalable(ResponseEventDto)
    public async createEvent(createEventDto: CreateEventDto): Promise<Event> {
        await this.eventValidatorSerivce.validateEventTime(createEventDto.owner.id, createEventDto.startTime, createEventDto.endTime);
        const event: Event = Object.assign(new Event(), createEventDto);
        event.eventLocation = await this.eventLocationService.createEventLocation(createEventDto.eventLocation);
        await this.eventRepository.createEvent(event);
        await this.chatService.createChatForOwner(event);
        return event;
    }

    //@scalableBulk(ResponseEventDto)
    public async getFeedEvents(feedRequest: FeedRequest, page, pageSize): Promise<Event[]> {
        const userId = feedRequest.currentUser.id;
        const cityId = feedRequest.currentUser.city.id;
        const categoriesId = feedRequest.categories ? feedRequest.categories : null;
        return this.eventRepository.getFeedEvents(userId, cityId, categoriesId as unknown as number[],
            feedRequest.location, feedRequest.targetDate, page, pageSize);
    }

    @scalableBulk(ResponseEventDto)
    public async getUserCreatedEvents(createdEventsReq: CreatedEventsRequest, page, pageSize): Promise<Event[]> {
        const currentUser: EventOwnerDto = createdEventsReq.currentUser;
        return this.eventRepository.getUserEvents(currentUser.id, page, pageSize);
    }

    @scalableBulk(ResponseEventDto)
    public async getVisitedEvents(visitedEventsReq: VisitedEventsRequest, page, pageSize) {
        return this.eventRepository.getVisitedEvents(visitedEventsReq.currentUser.id, page, pageSize);
    }

    @scalableBulk(ResponseEventDto)
    public async getUpcomingEvents(upcomingEventsRequest: UpcomingEventsRequest, page, pageSize) {
        return this.eventRepository.getUpcomingEvents(upcomingEventsRequest.currentUser.id, page, pageSize);
    }

    @scalableBulk(ResponseEventDto)
    public async getHistoryEvents(historyEventsRequest: HistoryEventsRequest, page, pageSize) {
        return this.eventRepository.getHistoryEvents(historyEventsRequest.currentUser.id, page, pageSize);
    }

    @scalableBulk(ResponseEventDto)
    public async getFavoriteEvents(favoriteEventsRequest: HistoryEventsRequest, page, pageSize) {
        return this.eventRepository.getFavoriteEvents(favoriteEventsRequest.currentUser.id, page, pageSize);
    }

    //@scalable(ResponseEventDto)
    public async getEventById(eventId: number, user = null) {
        const result: Event = await this.eventRepository.getEventById(eventId, user);
        if (!result) {
            throw new EventNotFoundError({id: eventId});
        }
        if (user) {
            const currentMember = result.eventMembers.find(member => {
                return member.userId === user.id;
            });
            if(currentMember) {
                //@ts-ignore
                result.currentUserApplicationStatus = currentMember.status;
            } else {
                //@ts-ignore
                result.currentUserApplicationStatus = null;
            }
        }
        return result;
    }

    public async deleteEventById(eventId: number) {
        const eventMembers = (await Promise.all(
            [this.eventMemberService.getApprovedMembers(eventId),
                this.eventMemberService.getAppliedMembers(eventId)])).flat();
        this.sendNotificationOnEventDelete(eventMembers);
        const result = this.eventRepository.deleteEventById(eventId);
        return result;
    }

    @scalable(ResponseEventDto)
    public async updateEvent(updateEventDto: UpdateEventDto): Promise<Event> {
        let isTimeUpdate = false;
        const oldEvent = await this.eventRepository.getEventById(updateEventDto.id);
        if (!oldEvent) {
            throw new EventNotFoundError({id: updateEventDto.id});
        }
        if (oldEvent.startTime != updateEventDto.startTime ||
            oldEvent.endTime != updateEventDto.endTime) {
            await this.eventValidatorSerivce.validateEventTime(updateEventDto.owner.id, updateEventDto.startTime, updateEventDto.endTime, updateEventDto.id);
            await this.eventRepository.flushEventMembers(updateEventDto);
            isTimeUpdate = true;
        }
        if (oldEvent.totalOfPersons != updateEventDto.totalOfPersons) {
            const approvedMembers = oldEvent.eventMembers.filter(member => member.status === StatusEnum.APPROVED);
            if (oldEvent.totalOfPersons < approvedMembers.length) {
                throw new CantAcceptAllError(null);
            }
        }
        const eventMembers = (await Promise.all(
            [this.eventMemberService.getApprovedMembers(updateEventDto.id),
                this.eventMemberService.getAppliedMembers(updateEventDto.id)])).flat();
        if (isTimeUpdate) {
            this.sendNotificationOnTimeUpdate(eventMembers);
        } else {
            this.sendNotificationOnTimelessDetailUpdate(eventMembers);
        }
        return this.eventRepository.updateEvent(Object.assign(new Event(), updateEventDto));
    }

    @scalableBulk(ResponseEventDto)
    public async searchEventsByTitle(searchScope: string, title: string, searchRequest: any, page, pageSize): Promise<Event[]> {
        return this.eventRepository.searchEventsByTitle(searchScope, title, searchRequest, page, pageSize);
    }

    public async sendNotificationOnTimeUpdate(members) {
        for (let member of members) {
            const notification = await this.pushNotificationService.getNotificationInstanceDefault(member.userId, {
                title: '?????????????? ??????????????????',
                message: '?????????? ?????????????? ???????? ????????????????. ?????????????????? ???????????? ?????????????',
                data: {
                    notification_type: 'EVENT_DETAILS_UPDATE',
                    eventId: member.eventId
                }
            }, 'EVENT_DETAILS_UPDATE', member.eventId);
            this.pushNotificationService.createAndSendNotification(notification);
        }
    }

    public async sendNotificationOnTimelessDetailUpdate(members) {
        for (let member of members) {
            const notification = await this.pushNotificationService.getNotificationInstanceDefault(member.userId, {
                title: '?????????????? ??????????????????',
                message: '???????????? ?????????????? ???????? ??????????????????',
                data: {
                    notification_type: 'EVENT_DETAILS_UPDATE',
                    eventId: member.eventId
                }
            }, 'EVENT_DETAILS_UPDATE', member.eventId);
            this.pushNotificationService.createAndSendNotification(notification);
        }
    }

    public async sendNotificationOnEventDelete(members) {
        for (let member of members) {
            const notification = await this.pushNotificationService.getNotificationInstanceDefault(member.userId, {
                title: '?????????????? ??????????????????',
                message: '???????????? ?????????????? ???????? ??????????????????',
                data: {
                    notification_type: 'EVENT_DELETED',
                    eventId: member.eventId
                }
            }, 'EVENT_DELETED', member.eventId);
            this.pushNotificationService.createAndSendNotification(notification);
        }
    }
}