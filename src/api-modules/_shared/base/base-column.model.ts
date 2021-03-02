import { PrimaryGeneratedColumn } from 'typeorm';
import { BaseColumnDateModelModel } from './base-column-date.model';

export abstract class BaseColumnModel extends BaseColumnDateModelModel {
  @PrimaryGeneratedColumn()
  id: number;
}
