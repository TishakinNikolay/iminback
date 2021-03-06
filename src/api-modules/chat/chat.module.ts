import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {EventRepository} from '../event/repository/event.repository';
import {ChatController} from './chat.controller';
import {ChatService} from './chat.service';
import {ChatMemberRepository} from './repositories/chat-member.repository';
import {ChatMessageViewRepository} from './repositories/chat-message-view.repository';
import {ChatMessageRepository} from './repositories/chat-message.repository';
import {ChatRepository} from './repositories/chat.repository';
import {ChatGateway} from "./chat.gateway";
import {JwtService} from "../user/user-modules/auth/jwt.service";

@Module({
    providers:[
        ChatService, ChatGateway, JwtService
    ],
    imports:[
        TypeOrmModule.forFeature([
            ChatRepository,
            ChatMemberRepository,
            ChatMessageRepository,
            ChatMessageViewRepository])
    ],
    exports: [ChatService],
    controllers:[ChatController]
})
export class ChatModule {

}
