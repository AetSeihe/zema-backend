import { IsArray } from 'class-validator';

export class ReadMessageDTO {
  @IsArray()
  messagesId: number[];
}
