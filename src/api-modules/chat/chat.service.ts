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
      const [chat] = await Chat.find({eventId:eventId});
      const [existingChatMember]  = await ChatMember.find({chatId: chat.id, userId:userId, isActive: false});
      if(existingChatMember) {
          existingChatMember.isActive = true;
          return existingChatMember.save();
      }
      const chatMember = new ChatMember();
      chatMember.chat = chat;
      chatMember.userId = userId;
      return chatMember.save();
    }

    public async removeChatMemberOnDecline(userId: number, eventId: number) {
        const [chat] = await Chat.find({eventId:eventId});
        const [existingChatMember]  = await ChatMember.find({chatId: chat.id, userId:userId});
        existingChatMember.isActive = false
        existingChatMember.leaveDate = new Date();
        await this.chatMessageViewRepository.deleteViewsOnChatMemberDeactivation(chat.id, existingChatMember.id);
        return existingChatMember.save();
    }

    public async getUserChats(user: User, page: number, pageSize:number) : Promise<Chat[]> {
        const chats: Chat[] = await this.chatRepository.getUserChats(user, page, pageSize);
        return chats;
    }

    public async postMessage(user, chatId, text) {
        const [chatMember] = await ChatMember.find({chatId:chatId, userId: user.id});
        const message = new ChatMessage()
        message.chatId = chatId;
        message.messageText = text;
        message.chatMemberId = chatMember.id;
        const messageView: ChatMessageView = new ChatMessageView();
        messageView.chatMemberId = chatMember.id;
        message.chatMessageViews = [messageView];
        return message.save();
    }

    public async deleteMessage(messageId: number) {
        const messageToDelete = new ChatMessage();
        messageToDelete.id = messageId;
        return ChatMessage.remove(messageToDelete);
    }
    public async updateMessage(messageId: number, text:string) {
        const chatMessage  = new ChatMessage();
        chatMessage.id = messageId;
        chatMessage.messageText = text;
        return chatMessage.save();
    }

    public async onChatOpen(user, chatId: number) {
        const messages: ChatMessage[] = await  this.chatMessageRepository.getMessagesOnChatOpen(user,chatId);
        return messages;
    }

    public async getChatMessages(user, offsetMessageId, pageSize, chatId, vector) {
        const messages: ChatMessage[] = await this.chatMessageRepository.getMessagesOnScroll(user,offsetMessageId,pageSize,chatId,vector);
        return messages;
    }

    public async setMessagesViewed(ids) {
        await this.chatMessageViewRepository.setMessagesViewed(ids);
        return true;
    }
}