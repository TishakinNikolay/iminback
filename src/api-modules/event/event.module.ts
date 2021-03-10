import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";
import { EventRepository } from "./event.repository";
import { EventLocationModule } from "./event-modules/event-location/event-location.module";
import { SharedModule } from "../_shared/shared.module";

@Module({
    controllers: [EventController],
    providers: [EventService],
    imports: [
        EventLocationModule,
        SharedModule,
        TypeOrmModule.forFeature([EventRepository])]
})
export class EventModule { }