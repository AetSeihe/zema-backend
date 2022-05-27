import { IsNumberString, IsObject, IsOptional } from 'class-validator';

export class GetAllChatDataDTO {
  userName: string;
}

export class GetAllChatOptionsDTO {
  @IsNumberString()
  @IsOptional()
  limit: number;

  @IsNumberString()
  @IsOptional()
  offset: number;
}

export class GetChatsDTO {
  @IsObject()
  options: GetAllChatOptionsDTO;

  @IsObject()
  data: GetAllChatDataDTO;
}
