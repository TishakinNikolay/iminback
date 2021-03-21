import { EventMemberUserDto } from "./event-member.user.dto";

export class EventMemberApplyResponseDto {
    public eventId: number = null;
    public user: EventMemberUserDto = new EventMemberUserDto();
    public applicationDate: Date = new Date();
    
}