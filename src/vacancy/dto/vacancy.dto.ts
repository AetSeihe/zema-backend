import { ApiProperty } from '@nestjs/swagger';
import { UserDTO } from 'src/user/dto/user.dto';

export class VacancyDTO {
  constructor(partial: Partial<any>) {
    Object.assign(this, partial);

    if (partial.user) {
      this.user = new UserDTO(partial.user.get());
    }
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

  @ApiProperty()
  user: UserDTO;
}
