import {EntityRepository, Repository} from 'typeorm';
import {ChatMessage} from '../models/chat-message.entity';
import {Chat} from '../models/chat.entity';

@EntityRepository(Chat)
export class ChatRepository extends Repository<Chat> {
    public async getUserChats(user, page, pageSize) {
        const chats: Chat[] = await this
            .createQueryBuilder('chat')
            .innerJoinAndSelect('chat.chatMembers', 'chatMember', 'chatMember.chatId = chat.Id AND chatMember.userId = :curUserId')
            .setParameter('curUserId', user.id)
            .skip(page * pageSize)
            .take(pageSize)
            .getMany();
        return chats;
    }
}