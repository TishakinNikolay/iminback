import {BaseEntity, Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn} from 'typeorm';
import {BaseColumnDateModelModel} from '../../_shared/base/base-column-date.model';
import {BaseColumnModel} from '../../_shared/base/base-column.model';
import {User} from '../../user/models/user.entity';
import {ChatMessageView} from './chat-message-view.entity';
import {Chat} from './chat.entity';

@Entity('chat_member')
export class ChatMember extends BaseColumnModel {
    @Column()
    public userId: number;
    @Column()
    public chatId: number;
    @ManyToOne(() => Chat, chat => chat.chatMembers, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'chatId', referencedColumnName: 'id'})
    public chat: Chat;
    @ManyToOne(() => User, {onDelete: 'CASCADE', cascade:true})
    @JoinColumn({name: 'userId', referencedColumnName: 'id'})
    public user: User;
    @OneToMany(type => ChatMessageView, chatMessageView => chatMessageView.chatMember)
    @JoinColumn()
    public chatMessageViews: ChatMessageView[];
    @DeleteDateColumn()
    deletedAt?: Date;
}