import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";
import { EventRepository } from "./event.repository";
import { EventLocationModule } from "./event-modules/event-location/event-location.module";
import { UserModule } from "../user/user.module";
import { EventValidatorService } from "./event-validator.serivce";

@Module({
    controllers: [EventController],
    providers: [EventService, EventValidatorService],
    imports: [
        EventLocationModule,
        UserModule,
        TypeOrmModule.forFeature([EventRepository])]
})
export class EventModule { }