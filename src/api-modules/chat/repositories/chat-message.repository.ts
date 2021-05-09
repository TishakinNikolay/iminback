import {EntityRepository, Repository} from 'typeorm';
import {CustomUtils} from '../../../utils/custom-utils';
import {ScrollVectorEnum} from '../enums/scroll-vector.enum';
import {ChatMember} from '../models/chat-member.entity';
import {ChatMessageView} from '../models/chat-message-view.entity';
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
        const targetMessageIds = result.map(aggregateResult => aggregateResult.max);
        return this
            .createQueryBuilder('chat_message')
            .where('chat_message.id IN (:...ids)', {ids: targetMessageIds})
            .getMany();
    }

    public async getMessagesOnChatOpen(user, chatId) {
        const readUnreadCount = await
            this.query(`SELECT SUM(
                                       CASE WHEN "viewsAndChatMembers"."chatMessageViewId" IS NULL THEN 1 ELSE 0 END
                                   ) AS "newCount",
                               SUM(
                                       CASE WHEN "viewsAndChatMembers"."chatMessageViewId" IS NULL THEN 0 ELSE 1 END
                                   ) AS "oldCount"
                        FROM "chat_message" "innerMessage"
                                 LEFT JOIN (
                            SELECT "chatMessageView"."id"            AS "chatMessageViewId",
                                   "chatMessageView"."chatMessageId" AS "chatMessageViewChatMessageId"
                            FROM "chat_message_view" "chatMessageView"
                                     INNER JOIN "chat_member" "messageViewChatMember"
                                                ON "messageViewChatMember"."id" = "chatMessageView"."chatMemberId"
                                                    AND (
                                                       "messageViewChatMember"."deletedAt" IS NULL
                                                       )
                            WHERE (
                                "messageViewChatMember"."userId" = $2
                                )
                              AND (
                                "chatMessageView"."deletedAt" IS NULL
                                )
                        ) "viewsAndChatMembers" ON "viewsAndChatMembers"."chatMessageViewChatMessageId" = "innerMessage"."id"
                        WHERE (
                            "innerMessage"."chatId" = $1
                            )
                          AND (
                            "innerMessage"."deletedAt" IS NULL
                            )
                        GROUP BY "innerMessage"."chatId"`, [chatId, user.id]);
        const unreadLimit = Math.min(Number(readUnreadCount[0].newCount),25);
        const readLimit = 50 - unreadLimit;
        const result = await this
            .createQueryBuilder('chatMessage')
            .leftJoin( qb => {
                return qb
                    .select('"innerNewMessage"."chatId", "innerNewMessage"."id" AS "innerNewMessageId"')
                    .from(ChatMessage,'innerNewMessage')
                    .leftJoin( qb1 => {
                        return qb1
                            .select('"chatMessageView"."id" AS "chatMessageViewId",' +
                                '"chatMessageView"."chatMessageId" AS "chatMessageViewChatMessageId"')
                            .from(ChatMessageView,'chatMessageView')
                            .innerJoin(ChatMember,'messageViewChatMember','"messageViewChatMember"."id" = "chatMessageView"."chatMemberId"')
                            .where('"messageViewChatMember"."userId" = :userId')
                    },'viewsAndChatMembers','"viewsAndChatMembers"."chatMessageViewChatMessageId" = "innerNewMessage"."id"')
                    .where('"innerNewMessage"."chatId" = :chatId')
                    .andWhere('"viewsAndChatMembers"."chatMessageViewId" IS NULL')
                    .orderBy('innerNewMessage.id','ASC')
                    .limit(unreadLimit);
            },'newMessage', '"newMessage"."innerNewMessageId" = "chatMessage"."id"')
            .leftJoin(qb => {
                return qb
                    .select('"innerOldMessage"."chatId", "innerOldMessage"."id" AS "innerOldMessageId"')
                    .from(ChatMessage,'innerOldMessage')
                    .leftJoin( qb1 => {
                        return qb1
                            .select('"chatMessageView"."id" AS "chatMessageViewId",' +
                                '"chatMessageView"."chatMessageId" AS "chatMessageViewChatMessageId"')
                            .from(ChatMessageView,'chatMessageView')
                            .innerJoin(ChatMember,'messageViewChatMember','"messageViewChatMember"."id" = "chatMessageView"."chatMemberId"')
                            .where('"messageViewChatMember"."userId" = :userId')
                    },'viewsAndChatMembers','"viewsAndChatMembers"."chatMessageViewChatMessageId" = "innerOldMessage"."id"')
                    .where('"innerOldMessage"."chatId" = :chatId')
                    .andWhere('"viewsAndChatMembers"."chatMessageViewId" IS NOT NULL')
                    .orderBy('innerOldMessage.id','DESC')
                    .limit(readLimit);
            },'oldMessage', '"oldMessage"."innerOldMessageId" = "chatMessage"."id"')
            .innerJoinAndSelect('chatMessage.chatMember','chatMemberResponse')
            .innerJoinAndSelect('chatMemberResponse.user','user')
            .leftJoinAndSelect('chatMessage.chatMessageViews','messageViewResponse',
                '"messageViewResponse"."chatMemberId" = ' +
                '(SELECT "chat_member"."id" FROM "chat_member" WHERE "chat_member"."chatId" = :chatId AND "chat_member"."userId" = :userId)')
            .where('("newMessage"."innerNewMessageId" IS NOT NULL OR "oldMessage"."innerOldMessageId" IS NOT NULL)')
            .orderBy('chatMessage.id','ASC')
            .setParameter('chatId',chatId)
            .setParameter('userId',user.id)
            .getMany();
        const chat = await Chat.findOne(chatId,{relations:['event', 'event.image']})
        return {chat, messages: result};
    }

    public async getMessagesOnScroll(user, offsetMessageId, pageSize, chatId, vector) {
        const vectorSign = vector === ScrollVectorEnum.UP ? '<' : '>';
        const order = vector === ScrollVectorEnum.UP ? 'DESC' : 'ASC';
        const query = this
            .createQueryBuilder('chatMessage')
            .innerJoinAndSelect('chatMessage.chatMember','chatMemberResponse')
            .innerJoinAndSelect('chatMemberResponse.user','user')
            .leftJoinAndSelect('chatMessage.chatMessageViews','messageViewResponse',
                '"messageViewResponse"."chatMemberId" = ' +
                '(SELECT "chat_member"."id" FROM "chat_member" WHERE "chat_member"."chatId" = :chatId AND "chat_member"."userId" = :userId)')
            .where('"chatMessage"."chatId" = :chatId')
            .andWhere(`"chatMessage"."id" ${vectorSign} :offsetId`, {offsetId: offsetMessageId})
            .orderBy('chatMessage.id', order)
            .setParameter('chatId',chatId)
            .setParameter('userId',user.id);
        let result = await query.take(pageSize).getMany();
        if(order === 'DESC') {
           result.reverse();
        }
        return result;
    }

    public async setMessagesViewed(lastMessageId, chatId, user) {
        const [chatMember] = await ChatMember.find({chatId: chatId, userId : user.id});
        const messages = await this
            .createQueryBuilder('message')
            .select('"message"."id"')
            .leftJoin('message.chatMessageViews','messageView','"messageView"."chatMemberId" = :userChatMemberId')
            .where('"message"."chatId" = :chatId')
            .andWhere('"message"."id" <= :lastMessageId')
            .andWhere('"messageView"."id" IS NULL')
            .setParameter('chatId',chatId)
            .setParameter('curUserId',user.id)
            .setParameter('lastMessageId',lastMessageId)
            .setParameter('userChatMemberId',chatMember.id).getMany();
        if(messages.length === 0) return;
        const views = [];
        messages.forEach(msg => {
            const view = new ChatMessageView();
            view.chatMemberId = chatMember.id;
            view.chatMessageId = msg.id;
            views.push(view);
        })
        return ChatMessageView.save(views);
    }
}