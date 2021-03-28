import { InternalServerErrorException } from "@nestjs/common";
import { EventQueryBuilder } from "../../event-query-builder";

export abstract class EventSearchStrategy {
    constructor(protected readonly eventQueryBuilder: EventQueryBuilder) {

    }
    public abstract getSearchQuery(searchRequest: any);
}