import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class SendMessageDTO {
  @IsNumberString()
  userTo: number;

  @IsString()
  message: string;

  @IsNumberString()
  @IsOptional()
  pinnedMessage: number;

  files: Express.Multer.File[];
}
