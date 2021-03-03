import { BaseColumnModel } from '../_shared/base/base-column.model'
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne } from 'typeorm'
import { Category } from '../category/category.entity'
import { EventMember } from './event-modules/event-member/event-member.entity'
import { EventReaction } from './event-modules/event-reaction/event-reaction.entity'
import { EventLocation } from './event-modules/event-location/event-location.entity'

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
    @Column({ type: 'int', nullable: false })
    public organizerId: number
    @Column({ type: 'varchar', nullable: false, length: 5000 })
    public description: string
    @Column({ type: 'character varying', nullable: false, length: 350 })
    public image: string
    @Column({ type: 'int', nullable: false, default: 0 })
    public totalOfPersons: string

    @OneToOne(() => EventLocation, (location) => location.event)
    @JoinColumn({ name: 'eventId', referencedColumnName: 'id'})
    public eventLocation: EventLocation
    @OneToMany(() => EventMember, (member) => member.event)
    @JoinColumn({name: 'id', referencedColumnName: 'eventId'})
    public eventMember: EventMember[]
    @OneToMany(() => EventReaction, (reaction) => reaction.event)
    @JoinColumn({name: 'id', referencedColumnName: 'eventId'})
    public eventReaction: EventReaction[]
    @ManyToMany(() => Category)
    @JoinTable()
    public categories: Category[]
}