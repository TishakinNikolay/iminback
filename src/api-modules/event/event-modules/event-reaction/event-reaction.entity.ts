import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from '../../../user/models/user.entity';
import { BaseColumnDateModelModel } from '../../../_shared/base/base-column-date.model';
import { Event } from '../../models/event.entity';
import { EventReactionType } from './enums/event-reaction-type.enum';

@Entity('event_reaction')
export class EventReaction extends BaseColumnDateModelModel {
  @PrimaryColumn()
  public userId: number;
  @PrimaryColumn()
  public eventId: number;
  @Column({ type: 'enum', enum: EventReactionType, nullable: false })
  public reactionType: EventReactionType;

  @ManyToOne(() => Event, event => event.eventReactions)
  @JoinColumn({ name: 'eventId', referencedColumnName: 'id' })
  public event: Event;
  @ManyToOne(() => Event, user => user.eventReactions)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  public user: User;
}
