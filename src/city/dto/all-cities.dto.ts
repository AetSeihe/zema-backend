import { ApiProperty } from '@nestjs/swagger';
import { CityDto } from './city.dto';

export class AllCitiesDto {
  constructor(partial: Partial<AllCitiesDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  message: string;

  @ApiProperty()
  cities: CityDto[];
}
