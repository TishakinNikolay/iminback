import { BaseColumnModel } from '../_shared/base/base-column.model'
import { Column, Entity } from 'typeorm'

@Entity('country')
export class Country extends BaseColumnModel {
    @Column({ type: 'character varying', nullable: false, length: 150 })
    public name: string
}