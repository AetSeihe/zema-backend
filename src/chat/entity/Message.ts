import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  NotNull,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/user/entity/User.entity';
import { Chat } from './Chat.entity';
import { MessageFile } from './MessageFile';
import { PinnedMessage } from './PinnedMessage.enity';

@Table({
  modelName: 'message',
})
export class Message extends Model<Message> {
  id: number;

  @Column
  message: string;

  @ForeignKey(() => Chat)
  @AllowNull(false)
  @Column
  chatId: number;

  @BelongsTo(() => User, {
    as: 'user',
  })
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  userId: number;

  @HasMany(() => MessageFile)
  @ForeignKey(() => MessageFile)
  files: MessageFile[];

  @HasMany(() => PinnedMessage, {
    as: 'pinned-messages',
  })
  @ForeignKey(() => PinnedMessage)
  @Column
  pinnedMessagesId: number;
}
