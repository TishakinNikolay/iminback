import {SelectQueryBuilder} from 'typeorm';
import {SearchModeEnum} from '../../enums/search-mode.enum';
import {Event} from '../../models/event.entity';
import {EventQueryBuilder} from '../event-query-builder';
import {SearchCreatedEventsStrategy} from './search-strategies/created-search.strategy';
import {EventSearchStrategy} from './search-strategies/events-search.strategy';
import {SearchFavoriteEventsStrategy} from './search-strategies/favorite-events.strategy';
import {SearchFeedEventsStrategy} from './search-strategies/feed-search.strategy';
import {SearchHistoryEventsStrategy} from './search-strategies/history-search.strategy';
import {SearchUpcomingEventsStrategy} from './search-strategies/upcoming-search.strategy';
import {SearchVisitedEventsStrategy} from './search-strategies/visited-search.strategy';

export class EventSearchEngine {
    private searchStrategiesMap;

    public constructor(protected readonly eventQueryBuilder: EventQueryBuilder) {
        this.searchStrategiesMap = new Map<String, EventSearchStrategy>([
            [SearchModeEnum.FEED, new SearchFeedEventsStrategy(eventQueryBuilder)],
            [SearchModeEnum.CREATED, new SearchCreatedEventsStrategy(eventQueryBuilder)],
            [SearchModeEnum.UPCOMING, new SearchUpcomingEventsStrategy(eventQueryBuilder)],
            [SearchModeEnum.HISTORY, new SearchHistoryEventsStrategy(eventQueryBuilder)],
            [SearchModeEnum.FAVORITE, new SearchFavoriteEventsStrategy(eventQueryBuilder)],
            [SearchModeEnum.VISITED, new SearchVisitedEventsStrategy(eventQueryBuilder)]
        ]);
    }

    public getSearchByTitleQuery(searchScope: string, title: string, searchRequest: any): SelectQueryBuilder<Event> {
        const searchQuery: SelectQueryBuilder<Event> = this.searchStrategiesMap.get(searchScope).getSearchQuery(searchRequest);
        return searchQuery.andWhere('event.title LIKE :targetTitle').setParameter('targetTitle', `%${title}%`);
    }
}