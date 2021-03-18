import { Module } from '@nestjs/common';
import {DoubleGisService} from '../../services/2gis/double-gis.service';
import {MapController} from './map.controller';
import {MapService} from './map.service';

@Module({
    imports: [],
    controllers: [MapController],
    providers: [MapService, DoubleGisService]
})
export class MapModule {}