import { Exclude, Transform } from 'class-transformer';
import { Message } from 'src/chat/entity/Message.entity';
import { UserDTO } from 'src/user/dto/user.dto';
import { User } from 'src/user/entity/User.entity';
import { MessageDTO } from './message.dto';

export class ChatDTO {
  constructor(partial: Partial<ChatDTO>) {
    Object.assign(this, partial);

    const candidate = partial.userOne || partial.userTwo;
    this.companion = candidate && new UserDTO(candidate.get());
  }

  @Exclude()
  userOne: User | null;

  @Exclude()
  userTwo: User | null;

  companion: UserDTO;

  @Transform(({ value }) =>
    value?.map((msg) => new MessageDTO(msg.get()) || []),
  )
  messages: Message[];
}
