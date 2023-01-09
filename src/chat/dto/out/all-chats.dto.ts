import { ChatDTO } from './chat.dto';

export class AllChatsDTO {
  constructor(partial: Partial<any>) {
    Object.assign(this, partial);
  }
  chats: ChatDTO[];
}
