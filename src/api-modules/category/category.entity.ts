import { BaseColumnModel } from '../_shared/base/base-column.model';
import { Column, Entity, JoinTable, ManyToMany, OneToOne, JoinColumn } from 'typeorm';
import { Event } from '../event/models/event.entity';
import { Image } from '../image/models/image.entity';

@Entity('category')
export class Category extends BaseColumnModel {
    @Column({ type: 'character varying', nullable: false, length: 300 })
    public name: string
    @Column({ type: 'character varying', nullable: false, length: 350 })
    public value: string
    @OneToOne(type => Image, { nullable: true })
    @JoinColumn()
    public icon: Image

    @ManyToMany(() => Event)
    @JoinTable()
    public events: Event[]
}