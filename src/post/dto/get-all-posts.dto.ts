import { PostDTO } from './post.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetAllPostsDTO {
  constructor(partial: Partial<GetAllPostsDTO>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  message: string;

  @ApiProperty()
  posts: PostDTO[];
}
