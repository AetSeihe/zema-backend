import { Transform } from 'class-transformer';
import { ReplyMessage } from 'src/chat/entity/ReplyMessage';
import { MessageDTO } from './message.dto';

export class ReplyMessageDTO {
  constructor(partial: Partial<ReplyMessage>) {
    Object.assign(this, partial);
  }

  @Transform(({ value }) => new MessageDTO(value.get()))
  reply: MessageDTO;
}
