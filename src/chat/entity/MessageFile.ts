import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Message } from './Message';

@Table({
  modelName: 'chat-file',
})
export class MessageFile extends Model<MessageFile> {
  id: number;

  @BelongsTo(() => Message, {
    as: 'message',
  })
  @ForeignKey(() => Message)
  messageId: number;
  @Column
  fileUrl: string;
}
