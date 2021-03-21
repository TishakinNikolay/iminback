import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventReactionController } from "./event-reaction.controller";
import { EventReactionRepository } from "./event-reaction.repository";
import { EventReactionService } from "./event-reaction.service";

@Module({
    imports: [TypeOrmModule.forFeature([EventReactionRepository])],
    providers: [EventReactionService],
    controllers: [EventReactionController]

})
export class EventReactionModule { }