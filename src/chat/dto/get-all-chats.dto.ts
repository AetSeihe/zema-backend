import { ChatDto } from './chat.dto';

export class GetAllChatsDTO {
  constructor(partial: Partial<GetAllChatsDTO>) {
    Object.assign(this, partial);
  }

  message: string;
  chats: ChatDto[];
}
