import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/user/entity/User.entity';
import { Message } from './Message.entity';
import { MessageFile } from './MessageFile.entity';

@Table({
  tableName: 'chat',
})
export class Chat extends Model<Chat> {
  @Column
  @ForeignKey(() => User)
  userOneId: number;

  @BelongsTo(() => User, {
    as: 'userOne',
    foreignKey: 'userOneId',
  })
  userOne: User;

  @Column
  @ForeignKey(() => User)
  userTwoId: number;

  @BelongsTo(() => User, {
    as: 'userTwo',
    foreignKey: 'userTwoId',
  })
  userTwo: User;

  @HasMany(() => Message, {
    as: 'messages',
  })
  messages: Message[];

  @HasMany(() => MessageFile)
  files: MessageFile[];
}
