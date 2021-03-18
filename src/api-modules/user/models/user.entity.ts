import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { City } from '../../city/city.entity';
import { EventMember } from '../../event/event-modules/event-member/event-member.entity';
import { EventReaction } from '../../event/event-modules/event-reaction/event-reaction.entity';
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
    @Column({ type: 'timestamp with time zone', nullable: true })
    public dateOfBirth: Date;
    @Column({ type: 'enum', enum: GenderEnum, nullable: false })
    public gender: GenderEnum;
    @ManyToOne(type => City, city => city.users, { nullable: true })
    public city?: City;
    @Column({ type: 'character varying', nullable: true, length: 300 })
    public email: string;

    @OneToMany(type => Event, event => event.owner)
    events: Event[];
    @OneToMany(type => EventMember, eventMember => eventMember.user)
    eventMembers: EventMember[];
    @OneToMany(type => EventReaction, eventReaction => eventReaction.user)
    eventReactions: EventReaction[];


}