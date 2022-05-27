import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeletePhotoRequestDTO {
  @ApiProperty()
  @IsString()
  photo_name: string;
}
