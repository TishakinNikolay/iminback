import { FeedEventCategory } from "./feed-event.category.dto";
import { FeedEventCurrentUser } from "./feed-event.current-user.dto";

export class FeedRequest {
    public currentUser: FeedEventCurrentUser;
    public categories: FeedEventCategory[];
    constructor() { }
}