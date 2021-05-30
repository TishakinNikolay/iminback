import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ChatModule} from '../chat/chat.module';
import {PushNotificationModule} from '../push-notifications/push-notification.module';
import {PushNotificationService} from '../push-notifications/push-notification.service';
import {UserModule} from '../user/user.module';
import {EventController} from './controllers/event.controller';
import {EventLocationModule} from './event-modules/event-location/event-location.module';
import {EventMemberModule} from './event-modules/event-member/event-member.module';
import {EventMemberRepository} from './event-modules/event-member/event-member.repository';
import {EventMemberService} from './event-modules/event-member/event-member.service';
import {EventReactionModule} from './event-modules/event-reaction/event-reaction.module';
import {EventValidatorService} from './event-validator.service';
import {EventService} from './event.service';
import {EventRepository} from './repository/event.repository';

@Module({
    controllers: [EventController],
    providers: [EventService, EventValidatorService, EventMemberService],
    imports: [
        EventLocationModule,
        EventMemberModule,
        EventReactionModule,
        UserModule,
        TypeOrmModule.forFeature([EventRepository]),
        TypeOrmModule.forFeature( [EventMemberRepository]),
        forwardRef( () => PushNotificationModule),
        ChatModule
    ],
    exports: [EventValidatorService, EventService, EventMemberModule]
})
export class EventModule {
}
