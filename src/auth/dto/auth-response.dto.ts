import { UserDTO } from 'src/user/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDTO {
  constructor(partial: Partial<AuthResponseDTO>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  message: string;

  @ApiProperty()
  token: string;

  @ApiProperty()
  user: UserDTO;
}
