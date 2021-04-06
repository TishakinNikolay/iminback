import {StatusEnum} from '../../../event-modules/event-member/enums/status.enum';

export class ResponseEventMemberDto {
    public userId: number = null;
    public eventId: number = null;
    public status: StatusEnum = null;
}