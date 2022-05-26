import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Message } from './Message.entity';
import { MessageAndPintedMessage } from './MessageAndPintedMessage';

@Table({
  modelName: 'pinned-message',
})
export class PinnedMessages extends Model<PinnedMessages> {
  @BelongsTo(() => Message, {
    as: 'message',
  })
  @ForeignKey(() => Message)
  @Column
  messageId: number;

  @BelongsTo(() => MessageAndPintedMessage, {
    as: 'MessageAndPintedMessage',
  })
  @ForeignKey(() => MessageAndPintedMessage)
  @Column
  messageAndPintedMessageId: number;
}
