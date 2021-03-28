import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { EventLocationModule } from './event-modules/event-location/event-location.module';
import { EventMemberModule } from './event-modules/event-member/event-member.module';
import { EventReactionModule } from './event-modules/event-reaction/event-reaction.module';
import { EventValidatorService } from './event-validator.serivce';
import { EventController } from './controller/event.controller';
import { EventRepository } from './repository/event.repository';
import { EventService } from './event.service';

@Module({
    controllers: [EventController],
    providers: [EventService, EventValidatorService],
    imports: [
        EventLocationModule,
        EventMemberModule,
        EventReactionModule,
        UserModule,
        TypeOrmModule.forFeature([EventRepository])],
    exports: [EventValidatorService, EventService]
})
export class EventModule { }