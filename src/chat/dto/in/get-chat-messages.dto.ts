import { IsNumberString } from 'class-validator';

export class GetChatMessagesDTO {
  constructor(partial: Partial<GetChatMessagesDTO>) {
    Object.assign(this, partial);
  }

  @IsNumberString()
  limit: number;

  @IsNumberString()
  offset: number;

  @IsNumberString()
  chatId: number;
}
