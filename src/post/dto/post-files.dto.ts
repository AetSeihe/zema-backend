import { ApiProperty } from '@nestjs/swagger';

export class PostFileDTO {
  constructor(partial: Partial<PostFileDTO>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  postId: number;

  @ApiProperty()
  fileName: string;
}
