import {EntityRepository, Repository} from 'typeorm';
import {ChatMessage} from '../models/chat-message.entity';
import {Chat} from '../models/chat.entity';

@EntityRepository(ChatMessage)
export class ChatMessageRepository extends Repository<ChatMessage> {
    public async getChatLastMessages(chats: Chat[]) {
        const result = await this.createQueryBuilder()
            .select('MAX(chat_message.id)')
            .from('chat_message', 'chat_message')
            .groupBy('chat_message.chatId')
            .where('chat_message.chatId IN (:...chatIds)', {chatIds: chats.map(chat => chat.id)})
            .execute();
        const targetMessageIds = result.map( aggregateResult => aggregateResult.max);
        return this
            .createQueryBuilder('chat_message')
            .where('chat_message.id IN (:...ids)',{ids:targetMessageIds})
            .getMany();
    }
}