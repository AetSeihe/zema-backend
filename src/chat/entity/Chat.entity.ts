import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/user/entity/User.entity';
import { Message } from './Message.entity';
@Table({
  modelName: 'chat',
})
export class Chat extends Model<Chat> {
  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  userOneId: number;

  @BelongsTo(() => User, {
    as: 'userOne',
    foreignKey: 'userOneId',
  })
  userOne: User;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  userTwoId: number;

  @BelongsTo(() => User, {
    as: 'userTwo',
    foreignKey: 'userTwoId',
  })
  userTwo: User;

  @HasMany(() => Message)
  messages: Message[];

  companion: User;
}
