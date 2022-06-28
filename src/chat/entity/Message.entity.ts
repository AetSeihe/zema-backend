import {
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/user/entity/User.entity';
import { Chat } from './Chat.entity';
import { MessageAndPintedMessage } from './MessageAndPintedMessage';
import { MessageFiles } from './MessageFiles.entity';
import { PinnedMessages } from './PinnedMessages.entity';

@Table({
  modelName: 'message',
})
export class Message extends Model<Message> {
  @BelongsTo(() => Chat, {
    as: 'chat',
  })
  @ForeignKey(() => Chat)
  @Column
  chatId: number;

  @BelongsTo(() => User, {
    as: 'user',
  })
  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column
  message: string;

  @HasMany(() => MessageFiles)
  files: MessageFiles[];

  @Default(false)
  @Column
  readed: boolean;

  @HasMany(() => MessageAndPintedMessage)
  pinnedMessage: PinnedMessages;
}
