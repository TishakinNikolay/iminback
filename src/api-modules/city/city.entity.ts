import { BaseColumnModel } from '../_shared/base/base-column.model';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Country } from '../country/country.entity';
import { User } from '../user/user.entity'
import { EventLocation } from '../event/event-modules/event-location/event-location.entity';
@Entity('city')
export class City extends BaseColumnModel {
    @Column({ type: 'character varying', nullable: false, length: 150 })
    public name: string

    @ManyToOne(type => Country, country => country.cities, { cascade: true })
    public country: Country
    @OneToMany(type => User, user => user.city)
    users: User[]
    @OneToMany(type => EventLocation, location => location.city)
    locations: EventLocation[]
}