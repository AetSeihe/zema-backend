import { IsBoolean, IsNumber } from 'class-validator';

export class SetLikeDTO {
  @IsNumber()
  postId: number;
}
