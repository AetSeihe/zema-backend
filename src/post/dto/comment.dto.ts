import { UserDTO } from 'src/user/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
  constructor(partial: Partial<any>) {
    Object.assign(this, partial);

    this.user = partial.user && new UserDTO(partial.user.get());
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  user: UserDTO;

  @ApiProperty()
  postId: number;

  @ApiProperty()
  text: string;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdAt: Date;
}
