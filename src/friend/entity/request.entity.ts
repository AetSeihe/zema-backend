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
  @Column
  userId: number;

  @BelongsTo(() => User, {
    as: 'user',
    foreignKey: 'userId',
  })
  user: User;

  @ForeignKey(() => User)
  @Column
  friendId: number;

  @BelongsTo(() => User, {
    as: 'friend',
    foreignKey: 'friendId',
  })
  friend: User;
}
