import { HasMany, Model, Table } from 'sequelize-typescript';
import { User } from 'src/user/entity/User.entity';
import { ChatUser } from './ChatUser.enity';
import { Message } from './Message';

@Table({
  modelName: 'chat',
})
export class Chat extends Model<Chat> {
  id: number;

  @HasMany(() => ChatUser)
  chatUsers: User[];

  @HasMany(() => Message)
  messages: Message[];
}
