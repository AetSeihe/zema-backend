import { IsNumber, IsObject, IsOptional } from 'class-validator';

export class GetAllChatDataDTO {
  userName: string;
}

export class GetAllChatOptionsDTO {
  @IsNumber()
  @IsOptional()
  limit: number;

  @IsNumber()
  @IsOptional()
  offset: number;
}

export class GetChatsDTO {
  @IsObject()
  options: GetAllChatOptionsDTO;

  @IsObject()
  data: GetAllChatDataDTO;
}
