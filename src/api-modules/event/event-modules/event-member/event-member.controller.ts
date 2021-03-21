import { EventMemberService } from './event-member.service';
import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { EventMemberApproveRequestDto } from "./models/dto/request/approve/event-member.approve.dto";
import { EventMemberApplyResponseDto } from "./models/dto/response/event-member.apply-response.dto";
import { EventMemberApproveResponseDto } from "./models/dto/response/event-member.approve-response.dto";
import { EventMemberDeclineResponseDto } from "./models/dto/response/event-member.decline-response.dto";
import { EventMemberApplyDto } from './models/dto/request/apply/event-member.apply.dto';
import { EventMemberResponseDto } from './models/dto/response/event-member.response.dto copy';

@Controller('/event-member')
export class EventMemberController {
    constructor(private readonly eventMemberService: EventMemberService) { }

    @Post('/apply')
    public async applyEventMember(@Body() eventMemberApply: EventMemberApplyDto): Promise<EventMemberApplyResponseDto> {
        return this.eventMemberService.applyMember(eventMemberApply);
    }

    @Delete()
    public async deleteEventMemberApplication(@Body() eventMemberDto: EventMemberApplyDto): Promise<void> {
        await this.eventMemberService.deleteEventMemberApplitacion(eventMemberDto);
    }

    @Get('/applied/:eventId')
    public async getAppliedMembers(@Param('eventId') eventId: number): Promise<EventMemberResponseDto[]> {
        return this.eventMemberService.getAppliedMembers(eventId);
    }

    @Get('/approved/:eventId')
    public async getApprovedMembers(@Param('eventId') eventId: number): Promise<EventMemberResponseDto[]> {
        return this.eventMemberService.getApprovedMembers(eventId);
    }

    @Put('/approve')
    public async approveEventMember(@Body() approveRequest: EventMemberApproveRequestDto): Promise<EventMemberApproveResponseDto> {
        return this.eventMemberService.approveEventMember(approveRequest);
    }

    @Put('/decline')
    public async declineEventMember(@Body() declineRequest: EventMemberApproveRequestDto): Promise<EventMemberDeclineResponseDto> {
        return this.eventMemberService.declineEventMember(declineRequest);
    }
}