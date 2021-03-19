import { Body, Controller, Post } from "@nestjs/common";
import { EventService } from "../../event.service";
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
}