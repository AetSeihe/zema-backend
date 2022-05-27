import { VacancyDTO } from './vacancy.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetVacancyResponseDTO {
  constructor(partial: Partial<GetVacancyResponseDTO>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  message: string;

  @ApiProperty()
  vacancy: VacancyDTO;
}
