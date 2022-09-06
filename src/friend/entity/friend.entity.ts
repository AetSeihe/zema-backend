import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/user/entity/User.entity';

@Table({
  modelName: 'friend-table',
})
export class Friend extends Model<Friend> {
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
