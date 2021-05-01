import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ChatModule} from '../../../chat/chat.module';
import {EventModule} from '../../event.module';
import {EventMemberController} from './event-member.controller';
import {EventMemberRepository} from './event-member.repository';
import {EventMemberService} from './event-member.service';


@Module({
    providers: [
        EventMemberService
    ],
    imports: [
        forwardRef(() => EventModule),
        forwardRef(() => ChatModule),
        TypeOrmModule.forFeature([EventMemberRepository])
    ],
    controllers: [EventMemberController]
})
export class EventMemberModule {

}