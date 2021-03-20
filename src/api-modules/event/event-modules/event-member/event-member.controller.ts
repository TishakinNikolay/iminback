import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { EventMemberService } from "./event-member.service";
import { EventMemberApplyDto } from "./models/dto/apply/event-member.apply.dto";
import { EventMemberResponseDto } from "./models/dto/response/event-member.response.dto";

@Controller('/event-member')
export class EventMemberController {
    constructor(private readonly eventMemberService: EventMemberService) { }

    @Post('/apply')
    public async applyEventMember(@Body() eventMemberApply: EventMemberApplyDto): Promise<EventMemberResponseDto> {
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
}