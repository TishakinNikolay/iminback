import { Column, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Category } from '../../category/category.entity';
import { Image } from '../../image/models/image.entity';
import { User } from '../../user/models/user.entity';
import { BaseColumnModel } from '../../_shared/base/base-column.model';
import { EventLocation } from '../event-modules/event-location/models/event-location.entity';
import { EventMember } from '../event-modules/event-member/models/event-member.entity';
import { EventReaction } from '../event-modules/event-reaction/models/event-reaction.entity';

@Entity('event')
export class Event extends BaseColumnModel {
    @Column({ type: 'character varying', nullable: false, length: 350 })
    public title: string;
    @Column({ type: 'timestamp', nullable: false })
    public startTime: Date;
    @Column({ type: 'timestamp', nullable: false })
    public endTime: Date;
    @ManyToOne(type => User, owner => owner.events)
    public owner: User;
    @Column({ type: 'varchar', nullable: false, length: 5000 })
    public description: string;
    @ManyToOne(type => Image, { nullable: true })
    @JoinColumn()
    public image: Image;
    @OneToOne(() => EventLocation, { cascade: true })
    @JoinColumn()
    public eventLocation: EventLocation;
    @Column({ type: 'int', nullable: false, default: 0 })
    public totalOfPersons: number;
    @DeleteDateColumn()
    deletedAt?: Date;

    @OneToMany(type => EventMember, member => member.event, { onDelete: 'CASCADE' })
    @JoinColumn()
    public eventMembers: EventMember[];
    @OneToMany(() => EventReaction, reaction => reaction.event, { onDelete: 'CASCADE' })
    @JoinColumn()
    public eventReactions: EventReaction[];
    @ManyToMany(type => Category, category => category.events, { onDelete: 'CASCADE' })
    @JoinTable()
    public categories: Category[];
}