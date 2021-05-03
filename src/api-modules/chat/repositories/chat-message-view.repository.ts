import {EntityRepository, Repository} from 'typeorm';
import {User} from '../../user/models/user.entity';
import {ChatMessageView} from '../models/chat-message-view.entity';
import {Chat} from '../models/chat.entity';

@EntityRepository(ChatMessageView)
export class ChatMessageViewRepository extends Repository<ChatMessageView> {
    public async getTotalUnread(user: User, chats: Chat[]) {
        const result = await this.query('' +
            'SELECT COUNT(chat_message_view.id), chat_message."chatId" FROM chat_message_view INNER JOIN chat_message ON chat_message_view."chatMessageId" = chat_message.id WHERE ' +
            'chat_message."chatId" IN (' + chats.map(chat => chat.id).join(',') +  ') AND chat_message_view."isViewed" = false GROUP BY chat_message."chatId"')
        return result;
    }

    public async setMessagesViewed(ids) {
        // return this
        //     .createQueryBuilder()
        //     .update(ChatMessageView)
        //     .set({isViewed:true})
        //     .where("id IN (:...ids)", {ids})
        //     .execute();
    }

}