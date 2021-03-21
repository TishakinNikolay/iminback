import { EventMemberUserDto } from "./event-member.user.dto";

export class EventMemberDeclineResponseDto {
    public eventId: number = null;
    public user: EventMemberUserDto = new EventMemberUserDto();
    public declineDate: Date = new Date();

}