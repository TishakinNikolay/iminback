import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'
import { BaseColumnDateModelModel } from '../../../_shared/base/base-column-date.model';
import { Event } from '../../models/event.entity'

@Entity('event_reaction')
export class EventReaction extends BaseColumnDateModelModel {
  @PrimaryColumn()
  public userId: number;
  @PrimaryColumn()
  public eventId: number;
  @Column({ type: 'character varying', nullable: false, length: 250 })
  public type: string;

  @ManyToOne(() => Event, (event) => event.eventReaction)
  @JoinColumn({name: 'eventId', referencedColumnName: 'id'})
  public event: Event
}
