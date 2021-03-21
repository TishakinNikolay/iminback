import { forwardRef, Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { scalable, scalableBulk } from '../../../_shared/decorators/remap.decorator';
import { EventValidatorService } from '../../event-validator.serivce';
import { EventService } from '../../event.service';
import { ResponseEventDto } from '../../models/dto/response/response-event.dto';
import { StatusEnum } from './enums/status.enum';
import { EventMemberRepository } from './event-member.repository';
import { EventMemberApplyDto } from './models/dto/request/apply/event-member.apply.dto';
import { EventMemberApproveRequestDto } from './models/dto/request/approve/event-member.approve.dto';
import { EventMemberDeclineRequestDto } from './models/dto/request/decline/event-member.decline.dto';
import { EventMemberApplyResponseDto } from './models/dto/response/event-member.apply-response.dto';
import { EventMemberApproveResponseDto } from './models/dto/response/event-member.approve-response.dto';
import { EventMemberDeclineResponseDto } from './models/dto/response/event-member.decline-response.dto';
import { EventMemberResponseDto } from './models/dto/response/event-member.response.dto';
import { EventMember } from './models/event-member.entity';

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
        const targetEvent: ResponseEventDto = await this.eventService.getEventById(eventMemberApply.eventId);
        await this.eventValidatorService.validateSelfEventApplication(eventMemberApply.userId, eventMemberApply.eventId);
        await this.eventValidatorService.validateApplicationEventTime(eventMemberApply.userId, targetEvent.startTime, targetEvent.endTime);
        const eventMember: EventMember = Object.assign(new EventMember(), eventMemberApply);
        eventMember.status = StatusEnum.APPLIED;
        return this.eventMemberRepository.applyMemberToEvent(eventMember);
    }

    public async deleteEventMemberApplitacion(eventMemberDto: EventMemberApplyDto): Promise<void> {
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
        const { startTime, endTime }: ResponseEventDto = await this.eventService.getEventById(approveRequest.eventId);
        await this.eventMemberRepository.flushCollisedApplications(startTime, endTime, approveRequest.userId);

        const partialEventMember: EventMember = Object.assign(new EventMember(), approveRequest);
        partialEventMember.approvalDate = moment().utc().toDate();

        await this.eventMemberRepository.approveEventMember(partialEventMember);

        return this.eventMemberRepository.getEventMember(approveRequest.eventId, approveRequest.userId);
    }

    @scalable(EventMemberDeclineResponseDto)
    public async declineEventMember(declineRequest: EventMemberDeclineRequestDto): Promise<EventMember> {
        const partialEventMember: EventMember = Object.assign(new EventMember(), declineRequest);
        partialEventMember.declineDate = moment().utc().toDate();
        await this.eventMemberRepository.declineEventMember(partialEventMember);
        return this.eventMemberRepository.getEventMember(declineRequest.eventId, declineRequest.userId);
    }

}