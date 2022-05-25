import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class SendMessageDTO {
  @IsNumberString()
  userTo: number;

  @IsString()
  @IsOptional()
  message: string;

  @IsNumberString()
  @IsOptional()
  pinnedMessage: number;
}
