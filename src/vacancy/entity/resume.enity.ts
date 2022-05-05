import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/user/entity/User.entity';

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

  @Column
  description: string;

  @Column
  citizenship: string;

  @Column
  experience: string;

  @Column
  phone: string;

  @Column
  email: string;

  @ForeignKey(() => User)
  @BelongsTo(() => User, {
    as: 'user',
  })
  userId: number;
}
