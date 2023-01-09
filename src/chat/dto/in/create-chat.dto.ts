import { IsNumberString } from 'class-validator';

export class CreateChatDTO {
  constructor(partial: Partial<CreateChatDTO>) {
    Object.assign(this, partial);
  }

  @IsNumberString()
  userOneId: string;

  @IsNumberString()
  userTwoId: string;
}
