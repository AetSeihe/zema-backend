import { ApiProperty } from '@nestjs/swagger';
import { UserImageDTO } from './user-Image.dto';

export class UserMainImageDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  image: UserImageDTO;
}
