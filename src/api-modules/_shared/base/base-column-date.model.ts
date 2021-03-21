import { BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseColumnDateModelModel extends BaseEntity {
  @CreateDateColumn({
    type: 'timestamp',
    nullable: true,
    default: () => 'NOW()',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
    default: () => 'NOW()',
  })
  public updatedAt: Date;
}
