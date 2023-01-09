import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { City } from 'src/city/entity/City.entity';
import { EmploymentEnum } from 'src/types/EmploymentEnum';
import { WorkFormat } from 'src/types/WorkFormat';
import { User } from 'src/user/entity/User.entity';
import { Skills } from './skills';

@Table({
  modelName: 'vacancy',
})
export class Vacancy extends Model<Vacancy> {
  @Column
  title: string;

  @Column
  minSalary: number;

  @Column
  maxSalary: number;

  @Default('fulltime')
  @Column(DataType.ENUM('fulltime', 'partTime'))
  employment: EmploymentEnum;

  @Default('office')
  @Column(DataType.ENUM('office', 'remote', 'hybrid'))
  workFormat: WorkFormat;

  @Column
  companyName: string;

  @Column(DataType.TEXT('long'))
  descriptionCompany: string;

  @Column(DataType.TEXT('long'))
  companyUrl: string;

  @Column(DataType.TEXT('long'))
  requirement: string;

  @Column(DataType.TEXT('long'))
  responsibilities: string;
  @HasMany(() => Skills)
  skills: Skills[];

  @Column
  workExperience: number;

  @Column(DataType.TEXT('long'))
  description: string;

  @BelongsTo(() => City, {
    as: 'city',
  })
  @ForeignKey(() => City)
  @Column
  cityId: number;

  city: City;

  @Column
  phone: string;

  @Column
  email: string;

  @ForeignKey(() => User)
  @BelongsTo(() => User, {
    as: 'user',
  })
  userId: number;

  user: User;
}
