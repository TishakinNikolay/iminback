import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne } from 'typeorm';
import { Event } from '../event/models/event.entity';
import { Image } from '../image/models/image.entity';
import { BaseColumnModel } from '../_shared/base/base-column.model';
import {GenderCategoryEnum} from './enums/gender.enum';

@Entity('category')
export class Category extends BaseColumnModel {
    @Column({ type: 'character varying', nullable: false, length: 300 })
    public name: string;
    @Column({ type: 'character varying', nullable: false, length: 350 })
    public value: string;
    @Column({ type: 'enum', enum: GenderCategoryEnum, nullable: false, default: GenderCategoryEnum.ALL })
    public gender: GenderCategoryEnum;
    @OneToOne(type => Image, { nullable: true })
    @JoinColumn()
    public icon: Image;

    @ManyToMany(() => Event)
    @JoinTable()
    public events: Event[];
}