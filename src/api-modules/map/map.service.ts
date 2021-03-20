import {Injectable} from '@nestjs/common';
import * as _ from 'lodash';
import {RequestGeocoderSearchDto} from '../../services/2gis/api/geocoder/models/requests/request-geocoder-search.dto';
import {ResponseSearchListDto} from '../../services/2gis/api/shared/models/response/response-search.list.dto';
import {RequestSearch} from '../../services/2gis/api/suggest/models/requests/request-search.dto';
import {DoubleGisService} from '../../services/2gis/double-gis.service';
import {EventService} from '../event/event.service';
import {RequestMapPointDto} from './models/dto/request/request-map.point.dto';
import {RequestMapSearchDto} from './models/dto/request/request-map.search.dto';

@Injectable()
export class MapService {
    constructor(
        private readonly doubleGisService: DoubleGisService,
        private readonly eventService: EventService,
    ) {}

    public async searchByAddress(search: RequestMapSearchDto): Promise<any> {
        const {page_size = 10, phrase = '', sortByPoint} = search;
        const pageSizeGeoCode = page_size / 2;
        let pageSizeSuggest = page_size / 2;
        let resultsGeocode: ResponseSearchListDto = {items: [], total: 0};
        let resultsSuggest: ResponseSearchListDto = {items: [], total: 0};

        try {
            resultsGeocode = await this.doubleGisService.api.geocodeApi.search(new RequestGeocoderSearchDto(phrase, pageSizeGeoCode));
        } catch (e) {
            if (e.status === 404) {
                pageSizeSuggest = page_size;
            } else {
                throw e;
            }
        }

        resultsGeocode.items = _.uniqBy(resultsGeocode.items, 'full_name');
        resultsGeocode.total = resultsGeocode.items.length;

        pageSizeSuggest += page_size - (pageSizeSuggest + resultsGeocode.total);

        try {
            resultsSuggest = await this.doubleGisService.api.suggestApi.suggestsByAddress(new RequestSearch(
                'route_endpoint',
                pageSizeSuggest,
                'ru_UA',
                search.phrase,
                sortByPoint
            ));
        } catch (e) {
            if (resultsGeocode.total < 0) {
                throw e;
            }
        }

        return {
            items: resultsSuggest.items.concat(resultsGeocode.items).map((i) => {
                return {
                    address: i.full_name,
                    purposeName: i.purpose_name,
                    point: {
                        lat: i.point.lat,
                        long: i.point.lon
                    }
                };
            }),
            total: resultsSuggest.total + resultsGeocode.total
        };
    }

    public async searchByCords(search: RequestMapPointDto) {
        return await this.doubleGisService.api.geocodeApi.searchOne({lat: search.lat, lon: search.long});
    }

    public async getEvents() {
        // return this.eventService.getFeedEvents()
    }
}
