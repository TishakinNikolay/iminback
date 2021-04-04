import { EventCategoryDto } from "../event-category.dto";
import { EventLocationDto } from "../event-location.dto";
import { EventOwnerDto } from "../event-owner.dto";


export class FeedRequest {
    public currentUser: EventOwnerDto;
    public categories?: EventCategoryDto[];
    public location?: EventLocationDto;
    public targetDate?: Date;
    constructor() { }
}