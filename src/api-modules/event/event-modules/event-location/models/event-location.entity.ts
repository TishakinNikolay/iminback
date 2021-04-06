import {Column, Entity, ManyToOne} from 'typeorm';
import {BaseColumnModel} from '../../../../_shared/base/base-column.model';
import {City} from '../../../../city/city.entity';

@Entity('event_location')
export class EventLocation extends BaseColumnModel {
    @ManyToOne(type => City, city => city.locations, {nullable: false})
    public city: City;
    @Column({type: 'character varying', nullable: false, length: 400})
    public name: string;
    @Column({type: 'character varying', nullable: false, length: 500, unique: true})
    public address: string;
    @Column({type: 'decimal', nullable: false})
    public long: number;
    @Column({type: 'decimal', nullable: false})
    public lat: number;
}
