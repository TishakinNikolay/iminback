import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";
import { EventRepository } from "./event.repository";
import { EventLocationModule } from "./event-modules/event-location/event-location.module";
import { UserModule } from "../user/user.module";
import { EventValidatorService } from "./event-validator.serivce";
import { EventMemberModule } from "./event-modules/event-member/event-member.module";

@Module({
    controllers: [EventController],
    providers: [EventService, EventValidatorService],
    imports: [
        EventLocationModule,
        EventMemberModule,
        UserModule,
        TypeOrmModule.forFeature([EventRepository])],
    exports: [EventValidatorService, EventService]
})
export class EventModule { }