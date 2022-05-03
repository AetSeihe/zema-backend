import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import { User } from 'src/user/entity/User.entity';

@Table({
  modelName: 'City',
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
}
