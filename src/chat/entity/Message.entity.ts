import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/user/entity/User.entity';
import { Chat } from './Chat.entity';
import { MessageFile } from './MessageFile.entity';
import { ReplyMessage } from './ReplyMessage';

@Table({
  tableName: 'message',
})
export class Message extends Model<Message> {
  @Column(DataType.TEXT('long'))
  message: string;

  @Default(false)
  @Column
  readed: boolean;

  @ForeignKey(() => Chat)
  @Column
  chatId: number;

  @BelongsTo(() => Chat)
  chat: Chat;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => Chat)
  user: User;

  @HasMany(() => ReplyMessage)
  replies: ReplyMessage;

  @HasMany(() => MessageFile)
  files: MessageFile;
}
