import { SelectQueryBuilder } from "typeorm";
import { Event } from "../../models/event.entity";
import { EventQueryBuilder } from "../event-query-builder";
import { SearchCreatedEventsStrategy } from "./search-strategies/created-search.strategy";
import { EventSearchStrategy } from "./search-strategies/events-search.strategy";
import { SearchFavoriteEventsStrategy } from "./search-strategies/favorite-events.strategy";
import { SearchFeedEventsStrategy } from "./search-strategies/feed-search.strategy";
import { SearchHistoryEventsStrategy } from "./search-strategies/history-search.strategy";
import { SearchUpcomingEventsStrategy } from "./search-strategies/upcoming-search.strategy";
import { SearchVisitedEventsStrategy } from "./search-strategies/visited-search.strategy";

export class EventSearchEngine {
    private searchStrategiesMap;
    public constructor(protected readonly eventQueryBuilder: EventQueryBuilder) {
        this.searchStrategiesMap = new Map<String, EventSearchStrategy>([
            ['feed', new SearchFeedEventsStrategy(eventQueryBuilder)],
            ['created', new SearchCreatedEventsStrategy(eventQueryBuilder)],
            ['upcoming', new SearchUpcomingEventsStrategy(eventQueryBuilder)],
            ['history', new SearchHistoryEventsStrategy(eventQueryBuilder)],
            ['favorite', new SearchFavoriteEventsStrategy(eventQueryBuilder)],
            ['visited', new SearchVisitedEventsStrategy(eventQueryBuilder)]
        ])
    }

    public getSearchByTitleQuery(searchScope: string, title: string, searchRequest: any) : SelectQueryBuilder<Event> {
        const searchQuery: SelectQueryBuilder<Event> = this.searchStrategiesMap.get(searchScope).getSearchQuery(searchRequest);
        return searchQuery.andWhere('event.title LIKE :targetTitle').setParameter('targetTitle', `%${title}%`);
    }
}