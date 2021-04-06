import {Column, Entity, JoinColumn, ManyToOne} from 'typeorm';
import {User} from '../../../../../api-modules/user/models/user.entity';
import {BaseColumnModel} from '../../../../_shared/base/base-column.model';
import {Event} from '../../../../event/models/event.entity';
import {EventReactionType} from '../enums/event-reaction-type.enum';

@Entity('event_reaction')
export class EventReaction extends BaseColumnModel {
    @Column()
    public userId: number;
    @Column()
    public eventId: number;
    @Column({type: 'enum', enum: EventReactionType, nullable: false})
    public reactionType: EventReactionType;

    @ManyToOne(() => Event, event => event.eventReactions)
    @JoinColumn({name: 'eventId', referencedColumnName: 'id'})
    public event: Event;
    @ManyToOne(() => User, user => user.eventReactions)
    @JoinColumn({name: 'userId', referencedColumnName: 'id'})
    public user: User;
}
