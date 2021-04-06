import {EventSearchStrategy} from './events-search.strategy';

export class SearchFavoriteEventsStrategy extends EventSearchStrategy {
    public getSearchQuery(searchRequest) {
        return this.eventQueryBuilder.getFavoriteQuery(searchRequest.currentUser.id);
    }
}