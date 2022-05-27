import { User } from '../entity/User.entity';
import { UserDTO } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class FindOneDTO {
  constructor(message: string, user: User) {
    this.message = message;
    this.user = new UserDTO(user);
  }

  @ApiProperty()
  message: string;

  @ApiProperty()
  user: UserDTO;
}
