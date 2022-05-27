import { CommentDto } from './comment.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CommentResponseDTO {
  constructor(partial: Partial<CommentResponseDTO>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  message: string;

  @ApiProperty()
  comment: CommentDto;
}
