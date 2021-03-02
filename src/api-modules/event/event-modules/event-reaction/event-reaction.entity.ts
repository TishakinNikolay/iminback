import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseColumnDateModelModel } from '../../../_shared/base/base-column-date.model';

@Entity('event_reaction')
export class EventReaction extends BaseColumnDateModelModel {
  @PrimaryColumn()
  public userId: number;
  @PrimaryColumn()
  public eventId: number;
  @Column({ type: 'character varying', nullable: false, length: 250 })
  public type: string;
}
