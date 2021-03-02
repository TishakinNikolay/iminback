import { BaseColumnModel } from '../_shared/base/base-column.model'
import { Column, Entity } from 'typeorm'

@Entity('city')
export class City extends BaseColumnModel {
    @Column({ type: 'character varying', nullable: false, length: 150 })
    public name: string
    @Column({ type: 'int', nullable: false })
    public countryId: string
}