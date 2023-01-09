import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Vacancy } from './vacancy.enity';

@Table({
  modelName: 'skills',
})
export class Skills extends Model<Skills> {
  @Column
  title: string;

  @Column
  @ForeignKey(() => Vacancy)
  vacancyId: number;
}
