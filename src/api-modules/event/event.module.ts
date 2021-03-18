import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { EventLocationModule } from './event-modules/event-location/event-location.module';
import { EventController } from './event.controller';
import { EventRepository } from './event.repository';
import { EventService } from './event.service';

@Module({
    controllers: [EventController],
    providers: [EventService],
    imports: [
        EventLocationModule,
        UserModule,
        TypeOrmModule.forFeature([EventRepository])]
})
export class EventModule { }