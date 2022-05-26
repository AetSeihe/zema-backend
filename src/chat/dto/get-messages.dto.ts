import { IsNumberString, IsOptional } from 'class-validator';

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
