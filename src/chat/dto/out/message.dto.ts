import { Transform } from 'class-transformer';
import { Message } from 'src/chat/entity/Message.entity';
import { ReplyMessage } from 'src/chat/entity/ReplyMessage';
import { MessageFileDTO } from './message-file.dto';
import { ReplyMessageDTO } from './reply-message.dto';

export class MessageDTO {
  constructor(partial: Partial<Message>) {
    Object.assign(this, partial);
  }

  chatId: number;

  @Transform(({ value }) => value.map((file) => new MessageFileDTO(file.get())))
  files: MessageFileDTO[];

  @Transform(({ value }) => value.map((msg) => new ReplyMessageDTO(msg.get())))
  replies: ReplyMessageDTO[];
}
