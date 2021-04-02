import { BaseColumnDateModelModel } from '../../../../../api-modules/_shared/base/base-column-date.model';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { EventReactionType } from '../enums/event-reaction-type.enum';
import { User } from '../../../../../api-modules/user/models/user.entity';
import { Event } from '../../../../event/models/event.entity';

@Entity('event_reaction')
export class EventReaction extends BaseColumnDateModelModel {
  @PrimaryColumn()
  public userId: number;
  @PrimaryColumn()
  public eventId: number;
  @PrimaryColumn({ type: 'enum', enum: EventReactionType, nullable: false })
  public reactionType: EventReactionType;

  @ManyToOne(() => Event, event => event.eventReactions)
  @JoinColumn({ name: 'eventId', referencedColumnName: 'id' })
  public event: Event;
  @ManyToOne(() => User, user => user.eventReactions)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  public user: User;
}
