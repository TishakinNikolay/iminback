import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../../../user/models/user.entity';
import { Event } from '../../../models/event.entity';
import { StatusEnum } from '../enums/status.enum';

@Entity('event_member')
export class EventMember extends BaseEntity {
  @PrimaryColumn()
  public userId: number;
  @PrimaryColumn()
  public eventId: number;
  @Column({ type: 'enum', enum: StatusEnum, nullable: false })
  public status: StatusEnum;
  @CreateDateColumn({
    type: 'timestamp without time zone',
    nullable: true,
    default: () => 'NOW()',
  })
  public applicationDate: Date;
  @Column({ type: 'timestamp with time zone', nullable: true })
  public approvalDate: Date;
  @Column({ type: 'timestamp with time zone', nullable: true })
  public declineDate: Date;

  @ManyToOne(() => Event, event => event.eventMembers)
  @JoinColumn({ name: 'eventId', referencedColumnName: 'id' })
  public event: Event;
  @ManyToOne(() => User, user => user.eventMembers)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  public user: User;
}
