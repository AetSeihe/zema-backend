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
import { ResumeSkills } from './resume-skills';

@Table({
  modelName: 'resume',
})
export class Resume extends Model<Resume> {
  @Column
  title: string;
  @Column
  salary: number;

  @Column
  workExperience: number;

  @Column(DataType.TEXT('long'))
  description: string;

  @Default('fulltime')
  @Column(DataType.ENUM('fulltime', 'partTime'))
  employment: EmploymentEnum;

  @Default('office')
  @Column(DataType.ENUM('office', 'remote', 'hybrid'))
  workFormat: WorkFormat;

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

  @HasMany(() => ResumeSkills)
  resumeSkills: ResumeSkills[];
}
