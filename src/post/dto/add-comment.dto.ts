import { IsNumber, IsString } from 'class-validator';

export class AddCommentDTO {
  @IsNumber()
  postId: number;

  @IsString()
  text: string;
}
