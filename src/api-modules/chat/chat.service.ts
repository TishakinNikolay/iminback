import {Injectable} from '@nestjs/common';
import {Message} from 'twilio/lib/twiml/MessagingResponse';
import {log} from 'util';
import {CustomUtils} from '../../utils/custom-utils';
import {Event} from '../event/models/event.entity';
import {User} from '../user/models/user.entity';
import {ChatMember} from './models/chat-member.entity';
import {ChatMessageView} from './models/chat-message-view.entity';
import {ChatMessage} from './models/chat-message.entity';
import {Chat} from './models/chat.entity';
import {ChatMemberRepository} from './repositories/chat-member.repository';
import {ChatMessageViewRepository} from './repositories/chat-message-view.repository';
import {ChatMessageRepository} from './repositories/chat-message.repository';
import {ChatRepository} from './repositories/chat.repository';

@Injectable()
export class ChatService {
    public constructor(private readonly chatRepository: ChatRepository,
                       private readonly chatMemberRepository : ChatMemberRepository,
                       private readonly chatMessageRepository: ChatMessageRepository,
                       private readonly chatMessageViewRepository: ChatMessageViewRepository) {
    }

    public async createChatForOwner(event: Event) {
        const chat = new Chat();
        chat.event = event;
        const ownerAsChatMember = new ChatMember();
        ownerAsChatMember.user = event.owner
        ownerAsChatMember.chat = chat;
        await chat.save();
        await ownerAsChatMember.save()
        return chat;
    }

    public async addChatMemberOnApprove(userId: number, eventId: number) {
      const approvedChatMember = new ChatMember();
      const [chat] = await Chat.find({eventId:eventId});
      approvedChatMember.chat = chat;
      approvedChatMember.userId = userId;
      let [existingChatMember] = await ChatMember.find({chatId:approvedChatMember.chat.id, userId:approvedChatMember.userId});
      if(existingChatMember && existingChatMember.deletedAt != null) {
          existingChatMember.deletedAt = null;
          return existingChatMember.save();
      }
      return approvedChatMember.save();
    }

    public async removeChatMemberOnDecline(userId: number, eventId: number) {
        let approvedChatMember = new ChatMember();
        const [chat] = await Chat.find({eventId:eventId});
        approvedChatMember.chat = chat;
        approvedChatMember.userId = userId;
        console.log(approvedChatMember);
        [approvedChatMember] = await ChatMember.find({chatId:approvedChatMember.chat.id, userId:approvedChatMember.userId});
        console.log(approvedChatMember);
        return ChatMember.softRemove(approvedChatMember);
    }

    public async getUserChats(user: User, page: number, pageSize:number) : Promise<Chat[]> {
        const chats: Chat[] = await this.chatRepository.getUserChats(user, page, pageSize);
        if (chats.length === 0) return chats;
        const chatsLastMessages = await this.chatMessageRepository.getChatLastMessages(chats);
        const chatIdTolastMessage = CustomUtils.getUniqueMapBy(chatsLastMessages, 'chatId');
        const totalUnread = await this.chatMessageViewRepository.getTotalUnread(user, chats);
        const chatIdTotalUnread = CustomUtils.getUniqueMapBy(totalUnread, 'chatId');
        chats.forEach(chat => {
            chat.chatMessages = chatIdTolastMessage.has(chat.id) ? [chatIdTolastMessage.get(chat.id) as ChatMessage] : [];
            chat.totalUnread = Number(chatIdTotalUnread.get(chat.id) ? chatIdTotalUnread.get(chat.id)['count'] : '0');
        })
        chats.sort((item1,item2) => {
            const lastMessageIt1 = item1.chatMessages[0];
            const lastMessageIt2 = item2.chatMessages[0];
            if(!lastMessageIt1 && !lastMessageIt2) return 0;
            if(!lastMessageIt1 && lastMessageIt2) return 1;
            if(lastMessageIt1 && !lastMessageIt2) return -1;
            if(lastMessageIt1.createdAt > lastMessageIt2.createdAt) return -1;
            if(lastMessageIt1.createdAt < lastMessageIt2.createdAt) return 1;
            if(lastMessageIt1.createdAt = lastMessageIt2.createdAt) return 1;
        });
        return chats;
    }

    public async postMessage(user, chatId, text) {
        const chatMembers: ChatMember[] = await ChatMember.find({chatId:chatId});
        const message = new ChatMessage()
        message.chatId = chatId;
        message.messageText = text;
        const messageView: ChatMessageView[] = [];
        chatMembers.forEach( member => {
            const chatMessageView = new ChatMessageView();
            chatMessageView.chatMemberId = member.id;
           if(member.userId === user.id) {
               message.chatMemberId = member.id;
               chatMessageView.isViewed = true;
           } else {
               chatMessageView.isViewed = false;
           }
           messageView.push(chatMessageView);
        });
        message.chatMessageViews = messageView;
        return message.save();
    }

    public async deleteMessage(messageId: number) {
        return ChatMessage.delete(messageId);
    }
    public async updateMessage(messageId: number, text:string) {
        const chatMessage  = new ChatMessage();
        chatMessage.id = messageId;
        chatMessage.messageText = text;
        return chatMessage.save();
    }
}