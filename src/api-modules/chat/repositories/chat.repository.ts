import {EntityRepository, Repository} from 'typeorm';
import {ChatMessageView} from '../models/chat-message-view.entity';
import {ChatMessage} from '../models/chat-message.entity';
import {Chat} from '../models/chat.entity';

@EntityRepository(Chat)
export class ChatRepository extends Repository<Chat> {
    public async getUserChats(user, page, pageSize) {
        const query = this
            .createQueryBuilder('chat')
            .addSelect('"messageAndViews"."totalUnread"','totalUnread')
            .innerJoinAndSelect(
                'chat.chatMembers','chatMember',
                'chatMember.userId = :curUserId AND chatMember.isActive = true',
                {curUserId : user.id})
            .leftJoinAndSelect((qb) =>{
                return qb
                    .select('MAX("chatMessageSubq"."id") AS "lastMessageId", "chatMessageSubq"."chatId"')
                    .from(ChatMessage,'chatMessageSubq')
                    .groupBy('"chatMessageSubq"."chatId"')
            },'lastMessage','"lastMessage"."chatId" = chat.id')
            .innerJoinAndSelect('chat.chatMessages','lastMessageEntity','lastMessageEntity.id = "lastMessage"."lastMessageId"')
            .leftJoinAndSelect((qb) => {
                   return qb
                    .select('SUM( CASE ' +
                        'WHEN "viewsAndChatMembers"."chatMessageViewId" IS NULL ' +
                        'THEN 1 ' +
                        'ELSE 0 ' +
                        'END) AS "totalUnread",' +
                        '"chatMessage"."chatId"')
                    .from(ChatMessage,'chatMessage')
                    .leftJoin((qb1) => {
                        return qb1
                            .select(
                                '"chatMessageView"."id" AS "chatMessageViewId",' +
                                '"chatMessageView"."chatMessageId" AS "chatMessageViewChatMessageId"')
                            .from(ChatMessageView,'chatMessageView')
                            .innerJoin(
                                'chatMessageView.chatMember',
                                'messageViewChatMember'
                            )
                            .where('messageViewChatMember.userId = :curUserId',{curUserId: user.id})
                    },'viewsAndChatMembers','"viewsAndChatMembers"."chatMessageViewChatMessageId" = chatMessage.id')
                    .groupBy('chatMessage.chatId')
                    },
                'messageAndViews','"messageAndViews"."chatId" = chat.id')
            .orderBy('lastMessageEntity.id','DESC')
            .skip(page * pageSize)
            .take(pageSize)
        const {raw, entities} = await query.getRawAndEntities();
        return entities.map( (entity, index) => {
            entity.totalUnread = Number(raw[index]['totalUnread']);
            return entity;
        })
    // .leftJoinAndSelect(
    //         'chatMessage.chatMessageViews',
    //         'chatMessageView',
    //         'chatMessageView.chatMemberId = chatMember.id');
    }
}