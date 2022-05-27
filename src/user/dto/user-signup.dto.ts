import { ApiProperty } from '@nestjs/swagger';

export class UserSignUp {
  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
