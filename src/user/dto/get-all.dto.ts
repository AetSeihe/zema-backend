import { UserDTO } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetAll {
  constructor(message: string, users: UserDTO[]) {
    this.message = message;
    this.users = users;
  }

  @ApiProperty()
  message: string;

  @ApiProperty({ type: [UserDTO] })
  users: UserDTO[];
}
