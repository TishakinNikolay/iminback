import {Module} from '@nestjs/common';
import {DoubleGisService} from '../../services/2gis/double-gis.service';
import {EventModule} from '../event/event.module';
import {MapController} from './map.controller';
import {MapService} from './map.service';

@Module({
    imports: [EventModule],
    controllers: [MapController],
    providers: [MapService, DoubleGisService]
})
export class MapModule {
}