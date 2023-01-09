import { BelongsTo, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Message } from './Message.entity';

@Table({
  tableName: 'reply-message',
})
export class ReplyMessage extends Model<ReplyMessage> {
  @ForeignKey(() => Message)
  messageId: number;

  @BelongsTo(() => Message, {
    as: 'message',
    foreignKey: 'messageId',
  })
  message: Message;

  @ForeignKey(() => Message)
  replyMessageId: number;

  @BelongsTo(() => Message, {
    as: 'reply',
    foreignKey: 'replyMessageId',
  })
  replyMessage: Message;
}
