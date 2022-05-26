import {
  Table,
  Model,
  BelongsTo,
  ForeignKey,
  Column,
} from 'sequelize-typescript';
import { Message } from './Message.entity';

@Table({
  modelName: 'message-file',
})
export class MessageFiles extends Model<MessageFiles> {
  @BelongsTo(() => Message, {
    as: 'message',
  })
  @ForeignKey(() => Message)
  messageId: number;

  @Column
  fileName: string;
}
