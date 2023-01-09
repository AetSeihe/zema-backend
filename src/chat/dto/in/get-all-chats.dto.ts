import { IsNumberString } from 'class-validator';

export class GetAllChatsDTO {
  constructor(partial: Partial<GetAllChatsDTO>) {
    Object.assign(this, partial);
  }

  limit: string;
  offset: string;
}
