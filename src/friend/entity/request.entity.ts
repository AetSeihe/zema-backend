import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/user/entity/User.entity';

@Table({
  modelName: 'request',
})
export class RequstFriend extends Model<RequstFriend> {
  id: number;
  @ForeignKey(() => User)
  @BelongsTo(() => User, {
    as: 'user',
  })
  @Column
  userId: number;
  user: User;

  @ForeignKey(() => User)
  @BelongsTo(() => User, {
    as: 'friend',
  })
  @Column
  friendId: number;
  friend: User;
}
