import {BaseEntity, Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn} from 'typeorm';
import {BaseColumnModel} from '../../_shared/base/base-column.model';
import {ChatMember} from './chat-member.entity';
import {ChatMessage} from './chat-message.entity';

@Entity('chat_message_view')
export class ChatMessageView extends BaseColumnModel {
    @Column()
    public chatMemberId: number;
    @Column()
    public chatMessageId: number;
    @ManyToOne(() => ChatMessage, chatMessage => chatMessage.chatMessageViews, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'chatMessageId', referencedColumnName: 'id'})
    public chatMessage: ChatMessage;
    @ManyToOne(() => ChatMember, chatMember => chatMember.chatMessageViews,{onDelete: 'CASCADE', cascade:true})
    @JoinColumn({name: 'chatMemberId', referencedColumnName: 'id'})
    public chatMember: ChatMember;
    @DeleteDateColumn()
    deletedAt?: Date;
}