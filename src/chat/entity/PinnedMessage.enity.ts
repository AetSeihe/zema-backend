import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Message } from './Message';

@Table({
  modelName: 'pinned-message',
})
export class PinnedMessage extends Model<PinnedMessage> {
  id: number;

  @BelongsTo(() => Message, {
    as: 'message',
  })
  @ForeignKey(() => Message)
  @Column
  messageId: number;

  @BelongsTo(() => Message, 'pinnedMessage')
  @ForeignKey(() => Message)
  pinnedMessagesId: number;
}
