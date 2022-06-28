import { ResumeDTO } from './resume.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetAllResumeResponseDTO {
  constructor(partial: Partial<GetAllResumeResponseDTO>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  message: string;

  @ApiProperty({ type: [ResumeDTO] })
  vacancies: ResumeDTO[];
}
