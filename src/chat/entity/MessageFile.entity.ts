import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { Chat } from './Chat.entity';
import { Message } from './Message.entity';

@Table({
  modelName: 'message-files',
})
export class MessageFile extends Model<MessageFile> {
  @ForeignKey(() => Chat)
  @Column
  chatId: number;

  @BelongsTo(() => Chat)
  chat: Chat;

  @ForeignKey(() => Message)
  @Column
  messageId: number;

  @BelongsTo(() => Message)
  message: Message;

  @AllowNull(false)
  @Column
  fileName: string;

  @AllowNull(false)
  @Column
  fileType: string;
}
