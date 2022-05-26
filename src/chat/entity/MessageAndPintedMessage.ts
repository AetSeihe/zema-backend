import {
  BelongsTo,
  Column,
  ForeignKey,
  Table,
  Model,
  HasMany,
} from 'sequelize-typescript';
import { Message } from './Message.entity';
import { PinnedMessages } from './PinnedMessages.entity';

@Table({
  modelName: 'message-pinted-message',
})
export class MessageAndPintedMessage extends Model<MessageAndPintedMessage> {
  @BelongsTo(() => Message, {
    as: 'message',
  })
  @ForeignKey(() => Message)
  @Column
  rootMessageId: number;

  @HasMany(() => PinnedMessages, {
    as: 'pinnedMessage',
  })
  @ForeignKey(() => PinnedMessages)
  pinnedMessageId: PinnedMessages[];
}
