import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseColumnModel } from '../_shared/base/base-column.model'

@Entity('image')
export class Image extends BaseColumnModel {
    @Column({ type: "varchar", length: 500 })
    uri: string
}