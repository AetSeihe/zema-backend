import { ApiProperty } from '@nestjs/swagger';
import { FriendDTO } from './friend.dto';

export class GetAllFriendDTO {
  constructor(partial: Partial<GetAllFriendDTO>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  message: string;

  @ApiProperty({ type: [FriendDTO] })
  friends: FriendDTO[];
}
