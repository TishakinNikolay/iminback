import {StatusEnum} from '../../../../enums/status.enum';

export class EventMemberApproveRequestDto {
    public eventId: number;
    public userId: number;
    public status: StatusEnum;
}