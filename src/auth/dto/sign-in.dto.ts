import { ApiProperty } from '@nestjs/swagger';

export class SignInDTO {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}
