import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";
import { EventRepository } from "./event.repository";
import { EventLocationModule } from "./event-modules/event-location/event-location.module";

@Module({
    controllers: [EventController],
    providers: [EventService],
    imports: [
        EventLocationModule,
        TypeOrmModule.forFeature([EventRepository])]
})
export class EventModule { }