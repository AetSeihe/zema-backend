import { UserDTO } from 'src/user/dto/user.dto';
import { FileDTO } from './file.dto';
import { PinnedMessageDTO } from './pinned-message.dto';

export class MessageDTO {
  constructor(partial: Partial<any>) {
    Object.assign(this, partial);

    this.user = partial.user && new UserDTO(partial.user.get());
  }

  id: number;
  chatId: number;
  userId: number;
  message: string;

  user: UserDTO;

  createdAt: Date;
  updatedAt: Date;

  files: FileDTO[];

  pinnedMessage: PinnedMessageDTO[];
}
