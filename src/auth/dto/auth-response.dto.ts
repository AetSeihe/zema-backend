import { UserDTO } from 'src/user/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDTO {
  @ApiProperty()
  message: string;

  @ApiProperty()
  token: string;

  @ApiProperty()
  user: UserDTO;
}
