import { ResumeDTO } from './resume.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetResumeResponseDTO {
  constructor(partial: Partial<GetResumeResponseDTO>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  message: string;

  @ApiProperty()
  vacancy: ResumeDTO;
}
