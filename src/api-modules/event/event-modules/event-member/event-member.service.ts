import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { scalable, scalableBulk } from "../../../_shared/base/remap-decorator";
import { EventValidatorService } from "../../event-validator.serivce";
import { EventService } from "../../event.service";
import { ResponseEventDto } from "../../models/dto/response/response-event.dto";
import { EventMemberRepository } from "./event-member.repository";
import { EventMemberApplyDto } from "./models/dto/apply/event-member.apply.dto";
import { EventMemberResponseDto } from "./models/dto/response/event-member.response.dto";
import { EventMember } from "./models/event-member.entity";

@Injectable()
export class EventMemberService {
    constructor(
        private readonly eventMemberRepository: EventMemberRepository,
        @Inject(forwardRef(() => EventValidatorService))
        private readonly eventValidatorService: EventValidatorService,
        @Inject(forwardRef(() => EventService))
        private readonly eventService: EventService) { }

    @scalable(EventMemberResponseDto)
    public async applyMember(eventMemberApply: EventMemberApplyDto): Promise<EventMember> {
        // if there is any approved event with intersected timerange - throws exception
        const targetEvent: ResponseEventDto = await this.eventService.getEventById(eventMemberApply.eventId);
        await this.eventValidatorService.validateEventTime(eventMemberApply.userId, targetEvent.startTime, targetEvent.endTime);
        const eventMember: EventMember = Object.assign(new EventMember(), eventMemberApply);
        return this.eventMemberRepository.applyMemberToEvent(eventMember);
    }

    private async
}