import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {EventLocationRepository} from './event-location.repository';
import {EventLocationService} from './event-location.service';


@Module({
    providers: [
        EventLocationService,
    ],
    exports: [EventLocationService],
    imports: [TypeOrmModule.forFeature([EventLocationRepository])]
})
export class EventLocationModule {
}