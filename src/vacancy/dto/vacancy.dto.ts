import { ApiProperty } from '@nestjs/swagger';

export class VacancyDTO {
  constructor(partial: Partial<any>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  salary: number;

  @ApiProperty()
  workExperience: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  cityId: number;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  userId: string;
}
