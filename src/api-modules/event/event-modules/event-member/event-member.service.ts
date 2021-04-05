import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {UpdateResult} from 'typeorm';
import {DatetimeService} from '../../../_shared/datetime.service';
import {scalable, scalableBulk} from '../../../_shared/decorators/remap.decorator';
import {EventValidatorService} from '../../event-validator.service';
import {EventService} from '../../event.service';
import {Event} from '../../models/event.entity';
import {StatusEnum} from './enums/status.enum';
import {CantAcceptAllError} from './errors/cant-accept-all.error';
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
        private readonly eventService: EventService) { }

    @scalable(EventMemberApplyResponseDto)
    public async applyMember(eventMemberApply: EventMemberApplyDto): Promise<EventMember> {
        // if there is any approved event with intersected timerange - throws exception
        const targetEvent = await this.eventService.getEventById(eventMemberApply.eventId);
        await this.eventValidatorService.validateSelfEventApplication(eventMemberApply.userId, eventMemberApply.eventId);
        await this.eventValidatorService.validateApplicationEventTime(eventMemberApply.userId, targetEvent.startTime, targetEvent.endTime);
        const eventMember: EventMember = Object.assign(new EventMember(), eventMemberApply);
        eventMember.status = StatusEnum.APPLIED;
        eventMember.applicationDate = DatetimeService.now();
        return this.eventMemberRepository.applyMemberToEvent(eventMember);
    }

    public async deleteEventMemberApplication(eventMemberDto: EventMemberApplyDto): Promise<void> {
        const eventMember: EventMember = Object.assign(new EventMember(), eventMemberDto);
        await this.eventMemberRepository.deleteEventMemberApplitacion(eventMember);
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
        const { startTime, endTime } = await this.eventService.getEventById(approveRequest.eventId);
        await this.eventMemberRepository.flushCollisedApplications(startTime, endTime, approveRequest.userId);

        const partialEventMember: EventMember = Object.assign(new EventMember(), approveRequest);
        partialEventMember.status = StatusEnum.APPROVED;
        partialEventMember.approvalDate = DatetimeService.now();

        await this.eventMemberRepository.approveEventMember(partialEventMember);

        return partialEventMember;
    }

    @scalable(EventMemberDeclineResponseDto)
    public async declineEventMember(declineRequest: EventMemberDeclineRequestDto): Promise<EventMember> {
        const partialEventMember: EventMember = Object.assign(new EventMember(), declineRequest);
        partialEventMember.status = StatusEnum.DECLINED;
        partialEventMember.declineDate = DatetimeService.now();
        await this.eventMemberRepository.declineEventMember(partialEventMember);
        return partialEventMember;
    }
    public async acceptAll(eventId: number) : Promise<UpdateResult[]> {
        const targetEvent: Event = await this.eventService.getEventById(eventId);
        const appliedMembers = targetEvent.eventMembers.filter(member => member.status === StatusEnum.APPLIED);
        const approvedMembers = targetEvent.eventMembers.filter(member => member.status === StatusEnum.APPROVED);
        if (targetEvent.totalOfPersons - approvedMembers.length < appliedMembers.length) {
            throw new CantAcceptAllError();
        }
        appliedMembers.forEach(member => member.status = StatusEnum.APPROVED);
        return Promise.all(appliedMembers
            .map( member => {
            return this.eventMemberRepository.flushCollisedApplications(targetEvent.startTime, targetEvent.endTime, member.userId)
            .then(() => this.eventMemberRepository.approveEventMember(member));
            }));
    }

}