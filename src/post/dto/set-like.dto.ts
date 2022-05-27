import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetLikeDTO {
  @ApiProperty()
  @IsNumber()
  postId: number;
}
