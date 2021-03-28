import { EventSearchStrategy } from "./events-search.strategy";

export class SearchHistoryEventsStrategy extends EventSearchStrategy {
    public getSearchQuery(searchRequest) {
        return this.eventQueryBuilder.getHistoryQuery(searchRequest.currentUser.id);
    }
}