import { BaseColumnModel } from '../../_shared/base/base-column.model'
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm'
import { Category } from '../../category/category.entity'
import { EventMember } from '../event-modules/event-member/event-member.entity'
import { EventReaction } from '../event-modules/event-reaction/event-reaction.entity'
import { EventLocation } from '../event-modules/event-location/models/event-location.entity'
import { User } from '../../user/models/user.entity'
import { Image } from '../../image/models/image.entity'

@Entity('event')
export class Event extends BaseColumnModel {
    @Column({ type: 'character varying', nullable: false, length: 350 })
    public title: string
    @Column({ type: 'timestamp with time zone', nullable: false })
    public date: Date
    @Column({ type: 'time', nullable: false })
    public startTime: Date
    @Column({ type: 'time', nullable: false })
    public endTime: Date
    @ManyToOne(type => User, owner => owner.events)
    owner: User
    @Column({ type: 'varchar', nullable: false, length: 5000 })
    public description: string
    @ManyToOne(type => Image, { nullable: true })
    @JoinColumn()
    public image: Image
    @OneToOne(() => EventLocation, {cascade : true})
    @JoinColumn()
    public eventLocation: EventLocation
    @Column({ type: 'int', nullable: false, default: 0 })
    public totalOfPersons: string

    @OneToMany(type => EventMember, member => member.event)
    @JoinColumn()
    public eventMembers: EventMember[]
    @OneToMany(() => EventReaction, reaction => reaction.event)
    @JoinColumn()
    public eventReactions: EventReaction[]
    @ManyToMany(type => Category, category => category.events)
    @JoinTable()
    public categories: Category[]
}