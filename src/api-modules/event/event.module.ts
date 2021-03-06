import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";
import { EventRepository } from "./repositories/eventRepository";


@Module({
    controllers:[EventController],
    providers: [EventService],
    imports: [TypeOrmModule.forFeature([EventRepository])]
})
export class EventModule {}