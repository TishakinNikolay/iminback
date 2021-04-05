import {Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards} from '@nestjs/common';
import {LocalGuard} from '../../../user/user-modules/auth/guards/local.guard';
import { EventMemberService } from './event-member.service';
import { EventMemberApplyDto } from './models/dto/request/apply/event-member.apply.dto';
import { EventMemberApproveRequestDto } from './models/dto/request/approve/event-member.approve.dto';
import { EventMemberApplyResponseDto } from './models/dto/response/event-member.apply-response.dto';
import { EventMemberApproveResponseDto } from './models/dto/response/event-member.approve-response.dto';
import { EventMemberDeclineResponseDto } from './models/dto/response/event-member.decline-response.dto';
import { EventMemberResponseDto } from './models/dto/response/event-member.response.dto';

@Controller('/event-member')
export class EventMemberController {
    constructor(private readonly eventMemberService: EventMemberService) { }

    @Put('/apply/:eventId')
    @UseGuards(LocalGuard)
    public async applyEventMember(@Param('eventId') eventId: number, @Request() req): Promise<EventMemberApplyResponseDto> {
        const userId = req.user.id;
        return this.eventMemberService.applyMember({eventId, userId});
    }

    @Delete('/:eventId')
    @UseGuards(LocalGuard)
    public async deleteEventMemberApplication(@Param('eventId') eventId: number, @Request() req): Promise<void> {
        const userId = req.user.id;
        await this.eventMemberService.deleteEventMemberApplitacion({eventId: eventId, userId : userId});
    }

    @Get('/applied/:eventId')
    @UseGuards(LocalGuard)
    public async getAppliedMembers(@Param('eventId') eventId: number): Promise<EventMemberResponseDto[]> {
        return this.eventMemberService.getAppliedMembers(eventId);
    }

    @Get('/approved/:eventId')
    @UseGuards(LocalGuard)
    public async getApprovedMembers(@Param('eventId') eventId: number): Promise<EventMemberResponseDto[]> {
        return this.eventMemberService.getApprovedMembers(eventId);
    }

    @Put('/approve')
    @UseGuards(LocalGuard)
    public async approveEventMember(@Body() approveRequest: EventMemberApproveRequestDto): Promise<EventMemberApproveResponseDto> {
        return this.eventMemberService.approveEventMember(approveRequest);
    }

    @Put('/decline')
    @UseGuards(LocalGuard)
    public async declineEventMember(@Body() declineRequest: EventMemberApproveRequestDto): Promise<EventMemberDeclineResponseDto> {
        return this.eventMemberService.declineEventMember(declineRequest);
    }
    @Put('/accept-all/:id')
    @UseGuards(LocalGuard)
    public async acceptAllMembers(@Param('eventId') eventId: number) {
        return this.eventMemberService.acceptAll(eventId);
    }
}