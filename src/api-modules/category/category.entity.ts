import { BaseColumnModel } from '../_shared/base/base-column.model'
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { Event } from '../event/models/event.entity'

@Entity('category')
export class Category extends BaseColumnModel {
    @Column({ type: 'character varying', nullable: false, length: 300 })
    public name: string
    @Column({ type: 'character varying', nullable: false, length: 350 })
    public value: string
    @Column({ type: 'character varying', nullable: false, length: 350 })
    public icon: string

    @ManyToMany(() => Event)
    @JoinTable()
    public events: Event[]
}