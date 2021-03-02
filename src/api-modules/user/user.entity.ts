import { Column, Entity } from 'typeorm'
import { BaseColumnModel } from '../_shared/base/base-column.model'

@Entity('user')
export class User extends BaseColumnModel {
    @Column({ type: 'character varying', nullable: false, length: 300 })
    public firstName: string
    @Column({ type: 'character varying', nullable: false, length: 300 })
    public lastName: string
    @Column({ type: 'character varying', nullable: false, length: 25 })
    public phone: string
    @Column({ type: 'int', nullable: false })
    public cityId: string
    @Column({ type: 'character varying', nullable: false, length: 300 })
    public profileImage: string
    @Column({ type: 'timestamp with time zone', nullable: true })
    public dateOfBirth: Date
}