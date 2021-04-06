import {EventSearchStrategy} from './events-search.strategy';

export class SearchFeedEventsStrategy extends EventSearchStrategy {
    public getSearchQuery(searchRequest) {
        return this.eventQueryBuilder.getFeedQuery(
            searchRequest.currentUser.id,
            searchRequest.userCityId,
            searchRequest.categoriesId,
            searchRequest.geo,
            searchRequest.targetDate);
    }
}