import { EventMemberUserDto } from "./event-member.user.dto";

export class EventMemberApproveResponseDto {
    public eventId: number = null;
    public user: EventMemberUserDto = new EventMemberUserDto();
    public approvalDate: Date = new Date();
    
}