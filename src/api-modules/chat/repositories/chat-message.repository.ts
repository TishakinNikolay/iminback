import {EntityRepository, Repository} from 'typeorm';
import {ScrollVectorEnum} from '../enums/scroll-vector.enum';
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

    public async getMessagesOnChatOpen(user, chatId) {
        const query = await this
            .createQueryBuilder('message')
            .select("COUNT(*)")
            .addSelect('messageView.isViewed','isViewed')
            .innerJoin('message.chatMessageViews', 'messageView')
            .innerJoin('messageView.chatMember','chatMember')
            .where('"message"."chatId" = :chatId', {chatId: chatId})
            .andWhere('"chatMember"."userId" = :userId', {userId: user.id})
            .groupBy('"messageView"."isViewed"');
        const countResult = await query.getRawMany();
        const oldCount = (countResult).filter( res => res['isViewed'] === false)[0].count;
        const newCount = (countResult).filter( res => res['isViewed'] === true)[0].count;
        if((oldCount + newCount) === 0 ) {
            return [];
        }
        const takeNew = Math.min(newCount, 25);
        const takeOld = Math.min(50 - takeNew,oldCount);

        const oldQuery = this.getOldMessageQuery(user,chatId);
        const newQuery = this.getNewMessageQuery(user,chatId);

        if(takeNew === 0) {
            return oldQuery.take(takeOld).getMany();
        }
        if(takeOld === 0) {
            return newQuery.take(takeNew).getMany();
        }
        return (await Promise.all([oldQuery.take(takeOld).getMany(),newQuery.take(takeNew).getMany()])).flat();
    }
    public getOldMessageQuery(user, chatId) {
        return this
            .createQueryBuilder('message')
            .innerJoinAndSelect('message.chatMessageViews', 'messageView')
            .innerJoin('messageView.chatMember','chatMember')
            .where('"message"."chatId" = :chatId', {chatId: chatId})
            .andWhere('"chatMember"."userId" = :userId', {userId: user.id})
            .andWhere('"messageView"."isViewed" = true')
            .orderBy('message.id','ASC');
    }
    public getNewMessageQuery(user, chatId) {
        return this
            .createQueryBuilder('message')
            .innerJoinAndSelect('message.chatMessageViews', 'messageView')
            .innerJoin('messageView.chatMember','chatMember')
            .where('"message"."chatId" = :chatId', {chatId: chatId})
            .andWhere('"chatMember"."userId" = :userId', {userId: user.id})
            .andWhere('"messageView"."isViewed" = false')
            .orderBy('message.id','ASC');
    }

    public async getMessagesOnScroll(user, offsetMessageId, pageSize, chatId, vector) {
        const vectorSign = vector === ScrollVectorEnum.UP ? '<' : '>';
        const order = vector === ScrollVectorEnum.UP ? 'DESC' : 'ASC'
        const query = this
            .createQueryBuilder('message')
            .innerJoinAndSelect('message.chatMessageViews', 'messageView')
            .innerJoin('messageView.chatMember','chatMember')
            .where('"message"."chatId" = :chatId', {chatId: chatId})
            .andWhere('"chatMember"."userId" = :userId', {userId: user.id})
            .andWhere(`"message"."id" ${vectorSign} :offsetId`, {offsetId: offsetMessageId})
            .orderBy('message.id', order);
        return query.take(pageSize).getMany();
    }
}