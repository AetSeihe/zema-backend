import { IsNumber, IsOptional } from 'class-validator';

export class GetChatOptions {
  @IsNumber()
  @IsOptional()
  limit = 15;

  @IsNumber()
  @IsOptional()
  offset = 1;
}
