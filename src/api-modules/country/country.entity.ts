import {Column, Entity, OneToMany} from 'typeorm';
import {BaseColumnModel} from '../_shared/base/base-column.model';
import {City} from '../city/city.entity';

@Entity('country')
export class Country extends BaseColumnModel {
    @Column({type: 'character varying', nullable: false, length: 150, unique: true})
    public name: string;

    @OneToMany(type => City, city => city.country)
    public cities?: City[];
}