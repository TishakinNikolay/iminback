import { EventOwnerDto } from '../event-owner.dto';

export class FavoriteEventsRequest {
    public currentUser: EventOwnerDto;
    constructor() { }
}