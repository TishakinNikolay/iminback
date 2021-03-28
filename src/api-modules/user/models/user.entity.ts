import { EventReaction } from '../../event/event-modules/event-reaction/models/event-reaction.entity';
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { City } from '../../city/city.entity';
import { EventMember } from '../../event/event-modules/event-member/models/event-member.entity';
import { Event } from '../../event/models/event.entity';
import { Image } from '../../image/models/image.entity';
import { BaseColumnModel } from '../../_shared/base/base-column.model';
import { GenderEnum } from '../enums/gender.enum';

@Entity('user')
export class User extends BaseColumnModel {
    @Column({ type: 'character varying', nullable: false, length: 300 })
    public firstName: string;
    @Column({ type: 'character varying', nullable: false, length: 300 })
    public lastName: string;
    @Column({ type: 'character varying', nullable: false, length: 25, unique: true })
    public phone: string;
    @ManyToOne(type => Image, { nullable: true })
    @JoinColumn()
    public profileImage: Image;
    @Column({ type: 'timestamp', nullable: true })
    public dateOfBirth: Date;
    @Column({ type: 'enum', enum: GenderEnum, nullable: false })
    public gender: GenderEnum;
    @Column({ type: 'character varying', nullable: false, length: 100, unique: true })
    public nickname: string;
    @DeleteDateColumn()
    deletedAt?: Date;

    @ManyToOne(type => City, city => city.users, { nullable: true })
    public city?: City;
    @OneToMany(type => Event, event => event.owner)
    events: Event[];
    @OneToMany(type => EventMember, eventMember => eventMember.user)
    eventMembers: EventMember[];
    @OneToMany(type => EventReaction, eventReaction => eventReaction.user)
    eventReactions: EventReaction[];
}