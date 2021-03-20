import { EventMemberUserImageDto } from "./event-member.user-image.dto";

export class EventMemberUserDto {
    public id: number = null;
    public profileImage: EventMemberUserImageDto = new EventMemberUserImageDto();
}