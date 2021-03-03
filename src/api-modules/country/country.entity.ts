import { BaseColumnModel } from '../_shared/base/base-column.model'
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm'
import { City } from '../city/city.entity'

@Entity('country')
export class Country extends BaseColumnModel {
    @Column({ type: 'character varying', nullable: false, length: 150 })
    public name: string

    @OneToMany(() => City, (city) => city.country)
    @JoinColumn({name: 'id', referencedColumnName: 'countryId'})
    public cities?: City[]
}