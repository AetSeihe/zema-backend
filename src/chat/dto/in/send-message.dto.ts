import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class SendMessageDTO {
  constructor(partial: Partial<SendMessageDTO>) {
    Object.assign(this, partial);
  }

  @IsString()
  message: string;

  @IsNumberString()
  userTo: string;

  @IsNumberString()
  @IsOptional()
  replyMessageId: string;
}
