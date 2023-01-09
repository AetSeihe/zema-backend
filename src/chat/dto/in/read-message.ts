import { IsNumber } from 'class-validator';

export class ReadMessageDTO {
  constructor(partial: Partial<ReadMessageDTO>) {
    Object.assign(this, partial);
  }

  @IsNumber()
  messagesId: number[];
}
