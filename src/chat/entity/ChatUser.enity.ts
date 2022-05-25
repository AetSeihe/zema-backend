import { BelongsTo, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from 'src/user/entity/User.entity';
import { Chat } from './Chat.entity';

@Table({
  modelName: 'chat-user',
})
export class ChatUser extends Model<ChatUser> {
  id: number;

  @BelongsTo(() => Chat, {
    as: 'chat',
  })
  @ForeignKey(() => Chat)
  chatId: number;

  @BelongsTo(() => User, {
    as: 'user',
  })
  @ForeignKey(() => User)
  userId: number;

  chat: Chat;
  user: User;
  chatUsers: any;
}
