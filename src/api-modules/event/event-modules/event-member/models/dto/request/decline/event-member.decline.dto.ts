import { StatusEnum } from "../../../../enums/status.enum";

export class EventMemberDeclineRequestDto {
    public eventId: number;
    public userId: number;
    public status: StatusEnum;
}