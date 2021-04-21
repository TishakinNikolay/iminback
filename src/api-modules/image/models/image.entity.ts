import {Column, Entity, JoinColumn, ManyToOne} from 'typeorm';
import {BaseColumnModel} from '../../_shared/base/base-column.model';
import {Category} from '../../category/category.entity';
import {Event} from '../../event/models/event.entity';
import {ImageThemeEnum} from '../enums/image-theme.enum';

@Entity('image')
export class Image extends BaseColumnModel {
    @Column({type: 'varchar', length: 500})
    public uri: string;
    @Column({type: 'bool'})
    public isActive: boolean;
    @Column({type: 'enum', enum: ImageThemeEnum})
    public theme: ImageThemeEnum;
    @Column({type: 'varchar', length: 50})
    public externalId;
    @ManyToOne(() => Category, category => category.images)
    public category: Category;
}