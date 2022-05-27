import { UserDTO } from 'src/user/dto/user.dto';
import { User } from 'src/user/entity/User.entity';

export class ChatDto {
  constructor(partial: Partial<any>) {
    Object.assign(this, partial);

    this.companion = partial.companion && new UserDTO(partial.companion.get());
  }

  id: number;

  user: User;
  companion: UserDTO;

  createdAt: Date;
  updatedAt: Date;
}
