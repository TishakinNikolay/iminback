import {Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany} from 'typeorm';
import {BaseColumnModel} from '../../_shared/base/base-column.model';
import {ChatMember} from './chat-member.entity';
import {ChatMessageView} from './chat-message-view.entity';
import {Chat} from './chat.entity';

@Entity('chat_message')
export class ChatMessage extends BaseColumnModel {
    @Column({type: 'character varying', nullable: false, length: 1000})
    public messageText: string;
    @Column()
    public chatMemberId: number;
    @Column()
    public chatId: number;
    @ManyToOne(() => Chat, chat => chat.chatMessages, {onDelete: 'CASCADE', cascade: true})
    @JoinColumn({name: 'chatId', referencedColumnName: 'id'})
    public chat: Chat;
    @ManyToOne(() => ChatMember, {nullable: true})
    @JoinColumn({name: 'chatMemberId', referencedColumnName: 'id'})
    public chatMember: ChatMember;
    @OneToMany(type => ChatMessageView, chatMessageView => chatMessageView.chatMessage, {cascade: true, onDelete:"CASCADE"})
    @JoinColumn()
    public chatMessageViews: ChatMessageView[];
    @DeleteDateColumn()
    deletedAt?: Date;
}