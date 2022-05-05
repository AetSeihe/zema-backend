import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './User.entity';

@Table({
  modelName: 'user_image',
})
export class UserImage extends Model {
  id: number;

  @ForeignKey(() => User)
  @BelongsTo(() => User, {
    as: 'user_id',
  })
  userId: number;

  @Column
  fileName: string;
}
