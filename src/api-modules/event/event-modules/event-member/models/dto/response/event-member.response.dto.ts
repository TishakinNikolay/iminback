import { EventMemberUserDto } from "./event-member.user.dto";

export class EventMemberResponseDto {
    public eventId: number = null;
    public user: EventMemberUserDto = new EventMemberUserDto();
    public applicationDate: Date = new Date();
    
}