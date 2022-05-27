import { FriendManagerItemDTO } from './friend.dto';
import { ApiProperty } from '@nestjs/swagger';

export class FriendManagerDataDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  friendId: number;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdAt: Date;
}

export class FriendManagerDTO {
  constructor(partial: Partial<FriendManagerDTO>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: FriendManagerItemDTO;
}
