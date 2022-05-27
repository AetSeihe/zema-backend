import { LikeDto } from './like.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ToogleLikeDTO {
  constructor(partial: Partial<ToogleLikeDTO>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  message: string;

  @ApiProperty()
  like: LikeDto;
}
