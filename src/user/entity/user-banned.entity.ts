import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './User.entity';

@Table({
  tableName: 'user-banned',
})
export class UserBanned extends Model<UserBanned> {
  @Column
  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => User, {
    foreignKey: 'userId',
  })
  user: User;

  @Column
  @ForeignKey(() => User)
  bannedUserId: number;

  @BelongsTo(() => User, {
    foreignKey: 'bannedUserId',
  })
  bannedUser: User;
}
