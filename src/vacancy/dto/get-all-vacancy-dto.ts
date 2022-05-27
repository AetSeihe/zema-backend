import { VacancyDTO } from './vacancy.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetAllVacancyResponseDTO {
  constructor(partial: Partial<GetAllVacancyResponseDTO>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  message: string;

  @ApiProperty({ type: [VacancyDTO] })
  vacancies: VacancyDTO[];
}
