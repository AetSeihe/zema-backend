import { ApiProperty } from '@nestjs/swagger';
import { FriendDTO } from './friend.dto';

export class GetAllRequestsDTO {
  constructor(partial: Partial<GetAllRequestsDTO>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  message: string;

  @ApiProperty({ type: [FriendDTO] })
  requests: FriendDTO[];
}
