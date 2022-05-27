import { IsNumberString, IsOptional } from 'class-validator';
import { MessageDTO } from './message.dto';
export class MessagesResponseDTO {
  constructor(partial: Partial<MessagesResponseDTO>) {
    Object.assign(this, partial);
  }

  message: string;
  messages: MessageDTO[];
}

export class GetMessagesDTO {
  @IsNumberString()
  chatId: number;

  @IsNumberString()
  @IsOptional()
  limit: number;

  @IsNumberString()
  @IsOptional()
  offset: number;
}
