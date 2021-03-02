import { CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm';

export abstract class BaseColumnDateModelModel extends BaseEntity {
  @CreateDateColumn({
    type: 'timestamp without time zone',
    nullable: true,
    default: () => 'NOW()',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    nullable: true,
    default: () => 'NOW()',
  })
  public updatedAt: Date;
}
