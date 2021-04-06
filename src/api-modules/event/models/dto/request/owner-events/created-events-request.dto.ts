import {EventOwnerDto} from '../event-owner.dto';

export class CreatedEventsRequest {
    public currentUser: EventOwnerDto;

    constructor() {
    }
}