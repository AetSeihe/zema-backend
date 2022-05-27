import { UserDTO } from 'src/user/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class FriendManagerItemDTO {
  constructor(partial: Partial<any>) {
    Object.assign(this, partial);
  }
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  friendId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class FriendDTO {
  constructor(partial: Partial<any>) {
    Object.assign(this, partial);

    this.user = partial.friend && new UserDTO(partial.friend.get());
    this.friend = undefined;
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  friend: undefined;

  @ApiProperty({
    required: false,
  })
  user: UserDTO;
}
