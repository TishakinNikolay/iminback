import { Column, Entity } from 'typeorm';
import { BaseColumnModel } from '../../../_shared/base/base-column.model';

@Entity('event_location')
export class EventLocation extends BaseColumnModel {
  @Column({ type: 'character varying', nullable: false, length: 250 })
  public country: string;
  @Column({ type: 'character varying', nullable: false, length: 250 })
  public city: string;
  @Column({ type: 'character varying', nullable: false, length: 400 })
  public name: string;
  @Column({ type: 'character varying', nullable: false, length: 500 })
  public address: string;
  @Column({ type: 'decimal', nullable: false })
  public long: number;
  @Column({ type: 'decimal', nullable: false })
  public lat: number;
}
