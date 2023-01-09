import { IsString } from 'class-validator';

export class GetChatsByMessageDTO {
  constructor(partial: Partial<GetChatsByMessageDTO>) {
    Object.assign(this, partial);
  }

  @IsString()
  text: number;
}
