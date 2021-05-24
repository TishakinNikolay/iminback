import {Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn} from 'typeorm';
import {BaseColumnModel} from '../../_shared/base/base-column.model';
import {EventMember} from '../../event/event-modules/event-member/models/event-member.entity';
import {Event} from '../../event/models/event.entity';
import {ChatMember} from './chat-member.entity';
import {ChatMessage} from './chat-message.entity';

@Entity('chat')
export class Chat extends BaseColumnModel {
    @Column()
    public eventId: number;
    @OneToOne(() => Event, event => event.eventMembers, {onDelete:"CASCADE", cascade:true})
    @JoinColumn({name: 'eventId', referencedColumnName: 'id'})
    public event: Event;
    @OneToMany(type => ChatMember, chatMember => chatMember.chat, {cascade:true})
    @JoinColumn()
    public chatMembers: ChatMember[];
    @OneToMany(type => ChatMessage, chatMessage => chatMessage.chat)
    @JoinColumn()
    public chatMessages: ChatMessage[];
    @DeleteDateColumn()
    deletedAt?: Date;

    public totalUnread:number;
}
