import { IsNumberString, IsOptional } from 'class-validator';

export class GetChatsDTO {
  @IsNumberString()
  @IsOptional()
  limit: number;

  @IsNumberString()
  @IsOptional()
  offset: number;
}
