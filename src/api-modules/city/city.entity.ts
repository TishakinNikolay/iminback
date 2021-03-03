import { BaseColumnModel } from '../_shared/base/base-column.model'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { Country } from '../country/country.entity'

@Entity('city')
export class City extends BaseColumnModel {
    @Column({ type: 'character varying', nullable: false, length: 150 })
    public name: string
    @Column({ type: 'int', nullable: false })
    public countryId: string

    @ManyToOne(() => Country, {cascade: true})
    @JoinColumn({name: 'countryId', referencedColumnName: 'id'})
    public country?: Country
}