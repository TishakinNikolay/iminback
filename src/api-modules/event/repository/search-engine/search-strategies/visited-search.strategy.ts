import { EventSearchStrategy } from "./events-search.strategy";

export class SearchVisitedEventsStrategy extends EventSearchStrategy {
    public getSearchQuery(searchRequest) {
        return this.eventQueryBuilder.getVisitedQuery(searchRequest.currentUser.id);
    }
}