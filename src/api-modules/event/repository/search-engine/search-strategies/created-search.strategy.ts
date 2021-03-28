import { EventSearchStrategy } from "./events-search.strategy";

export class SearchCreatedEventsStrategy extends EventSearchStrategy {
    public getSearchQuery(searchRequest) {
        return this.eventQueryBuilder.getCreatedQuery(searchRequest.currentUser.id);
    }
}