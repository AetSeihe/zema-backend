import { MessageDTO } from './message.dto';

export class PinnedMessageDTO {
  constructor(partial: Partial<any>) {
    Object.assign(this, partial);
  }
  id: number;
  messageId: number;

  message: MessageDTO;

  createdAt: Date;
  updatedAt: Date;
}
