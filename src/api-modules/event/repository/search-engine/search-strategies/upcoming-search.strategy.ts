import {EventSearchStrategy} from './events-search.strategy';

export class SearchUpcomingEventsStrategy extends EventSearchStrategy {
    public getSearchQuery(searchRequest) {
        return this.eventQueryBuilder.getUpcomingQuery(searchRequest.currentUser.id);
    }
}