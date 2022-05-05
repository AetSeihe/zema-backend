import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/user/entity/User.entity';

@Table({
  modelName: 'friend',
})
export class Friend extends Model<Friend> {
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
