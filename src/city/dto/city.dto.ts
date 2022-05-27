import { ApiProperty } from '@nestjs/swagger';

export class CityDto {
  constructor(partial: Partial<CityDto>) {
    Object.assign(this, partial);
  }
  @ApiProperty()
  id: number;

  @ApiProperty()
  regionId: number;

  @ApiProperty()
  title: string;
}
