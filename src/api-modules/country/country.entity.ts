import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { City } from '../city/city.entity';
import { BaseColumnModel } from '../_shared/base/base-column.model';

@Entity('country')
export class Country extends BaseColumnModel {
    @Column({ type: 'character varying', nullable: false, length: 150, unique: true })
    public name: string;

    @OneToMany(type => City, city => city.country)
    public cities?: City[];
}