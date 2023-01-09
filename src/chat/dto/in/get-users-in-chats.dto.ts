import { IsString } from 'class-validator';

export class GetUsersInChats {
  constructor(partial: Partial<GetUsersInChats>) {
    Object.assign(this, partial);
  }

  @IsString()
  name: string;
}
