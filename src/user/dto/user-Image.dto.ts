import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserImageDTO {
  constructor(partial: Partial<any>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  fileName: string;

  @Exclude()
  createdAt: string;

  @Exclude()
  updatedAt: string;

  @Exclude()
  userId: string;
}
