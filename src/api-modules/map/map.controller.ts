import {Body, Controller, Post} from '@nestjs/common';
import {RequestSeacrhPointDto} from '../../services/2gis/api/suggest/models/requests/request-seacrh.point.dto';
import {MapService} from './map.service';
import {RequestMapSearchDto} from './models/dto/request/request-map.search.dto';

@Controller('map')
export class MapController {
    constructor(private readonly mapService: MapService) {
    }

    @Post('search/address')
    public async searchByPhrase(@Body() search: RequestMapSearchDto) {
        return await this.mapService.searchByAddress(search);
    }

    @Post('search/point')
    public async searchByPoint(@Body() search: RequestSeacrhPointDto) {
        return await this.mapService.searchByCords(search);
    }
}