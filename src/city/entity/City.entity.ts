import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import { User } from 'src/user/entity/User.entity';
import { Vacancy } from 'src/vacancy/entity/vacancy.enity';

@Table({
  modelName: 'city',
  createdAt: false,
  updatedAt: false,
})
export class City extends Model<City> {
  id: number;

  @Column
  regionId: number;

  @Column
  title: string;

  @HasMany(() => User)
  users: User;

  @HasMany(() => Vacancy)
  resume: User;
}
