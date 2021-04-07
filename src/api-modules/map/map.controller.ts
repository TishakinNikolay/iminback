import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {RequestSeacrhPointDto} from '../../services/2gis/api/suggest/models/requests/request-seacrh.point.dto';
import {MapService} from './map.service';
import {RequestMapSearchDto} from './models/dto/request/request-map.search.dto';
import {LocalGuard} from '../user/user-modules/auth/guards/local.guard';
import {GetUser} from '../_shared/decorators/get-user-request.decorator';
import {User} from '../user/models/user.entity';

@Controller('map')
export class MapController {
    constructor(private readonly mapService: MapService) {
    }

    @UseGuards(LocalGuard)
    @Post('search/address')
    public async searchByPhrase(@Body() search: RequestMapSearchDto) {
        return await this.mapService.searchByAddress(search);
    }

    @UseGuards(LocalGuard)
    @Post('search/point')
    public async searchByPoint(@Body() search: RequestSeacrhPointDto, @GetUser() user: User) {
        return await this.mapService.searchByCords(search);
    }
}