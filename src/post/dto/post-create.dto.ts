import { ApiProperty } from '@nestjs/swagger';

export class PostCreateDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  text: string;
}
