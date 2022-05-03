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
export class UserImage extends Model<UserImage> {
  id: number;

  @ForeignKey(() => User)
  @BelongsTo(() => User, {
    as: 'user_id',
  })
  userId: number;

  user: User;
  friend: User;

  @Column
  fileName: string;
}
