import { Module } from "@nestjs/common";
import { EventLocationService } from "./event-location.service";


@Module({
    providers: [EventLocationService],
    exports: [EventLocationService]
})
export class EventLocationModule { }