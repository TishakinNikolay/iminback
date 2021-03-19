import { FeedEventCategory } from "./feed-event.category.dto";
import { FeedEventCurrentUser } from "./feed-event.current-user.dto";
import { FeedRequestLocation } from "./feed-request-location.dto";

export class FeedRequest {
    public currentUser: FeedEventCurrentUser;
    public categories: FeedEventCategory[];
    public location: FeedRequestLocation;
    constructor() { }
}