import {stringify} from 'querystring';
import {RequestSeacrhPointDto} from './request-seacrh.point.dto';

export class RequestSearch {
    constructor(public suggest_type: string,
                public page_size: number,
                public locale: string,
                public q: string,
                public sort_point?: RequestSeacrhPointDto) {
    }

    public toQueryParamsString(): string {
        if (!this.sort_point) {
            delete this.sort_point;
            return stringify({...(this as any)});
        } else {
            return stringify({...(this as any), sort_point: `${this.sort_point.lat},${this.sort_point.long}`});
        }
    }
}

// https://catalog.api.2gis.com/3.0/suggests?key=ruwkyx9103&suggest_type=address&page_size=15&locale=ru_UA&q=Одесса, маразли