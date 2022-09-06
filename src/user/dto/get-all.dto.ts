import { UserDTO } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetAll {
  constructor(message: string, users: UserDTO[], allCount?: number) {
    this.message = message;
    this.users = users;
    this.allCount = allCount;
  }

  @ApiProperty()
  message: string;

  @ApiProperty({
    required: false,
  })
  allCount: number;

  @ApiProperty({ type: [UserDTO] })
  users: UserDTO[];
}
