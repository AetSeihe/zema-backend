import { PostDTO } from './post.dto';
import { ApiProperty } from '@nestjs/swagger';

export class OnePostDTO {
  constructor(partial: Partial<OnePostDTO>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  message: string;

  @ApiProperty()
  post: PostDTO;
}
