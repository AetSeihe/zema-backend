import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCommentDTO {
  @ApiProperty()
  @IsNumber()
  postId: number;

  @ApiProperty()
  @IsString()
  text: string;
}
