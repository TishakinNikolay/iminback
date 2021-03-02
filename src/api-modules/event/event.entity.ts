import { BaseColumnModel } from '../_shared/base/base-column.model'
import { Column, Entity } from 'typeorm'

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
    @Column({ type: 'int', nullable: false })
    public locationId: number
    @Column({ type: 'int', nullable: false, default: 0 })
    public totalOfPersons: string
}