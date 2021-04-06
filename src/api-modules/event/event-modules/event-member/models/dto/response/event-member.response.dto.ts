import {StatusEnum} from '../../../enums/status.enum';
import {EventMemberUserDto} from './event-member.user.dto';

export class EventMemberResponseDto {
    public eventId: number = null;
    public userId: number = null;
    public user: EventMemberUserDto = new EventMemberUserDto();
    public status: StatusEnum = null;
    public applicationDate: Date = new Date();

}