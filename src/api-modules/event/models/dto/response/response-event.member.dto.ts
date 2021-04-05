import {StatusEnum} from '../../../event-modules/event-member/enums/status.enum';

export class ResponseEventMemberDto {
    public id: number = null;
    public status: StatusEnum = null;
}