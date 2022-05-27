import { Exclude } from 'class-transformer';
import { City } from 'src/city/entity/City.entity';
import { EducationEnum } from 'src/types/EducationEnum';
import { GenderEnum } from 'src/types/GenderEnum';
import { User } from '../entity/User.entity';
import { UserImageDTO } from './user-Image.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UserMainImageDTO } from './user-main-image.dto';

export class UserDTO {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
    this.images =
      partial.images?.map((image) => new UserImageDTO(image.get())) || [];
    this.password = undefined;
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  age: number;

  @Exclude()
  password: string;

  @ApiProperty()
  surname: string;

  @ApiProperty()
  patronomic: string;

  @ApiProperty()
  currentCity: City;

  @ApiProperty()
  birthCity: City;

  @ApiProperty()
  work: string;

  @ApiProperty()
  how_can_help: string;

  @ApiProperty()
  need_help: string;

  @ApiProperty({
    enum: ['null', 'male', 'female'],
    required: false,
  })
  gender: GenderEnum;

  @ApiProperty({
    enum: [
      'null',
      'average',
      'secondary_special',
      'unfinished_higher_education',
      'higher',
      'bachelor_degree',
      'master',
      'candidate_sciences',
      'doctor',
    ],
    required: false,
  })
  education: EducationEnum;

  @ApiProperty()
  images: UserImageDTO[];

  @Exclude()
  updatedAt: string;

  @Exclude()
  createdAt: string;

  @ApiProperty({
    type: UserMainImageDTO,
  })
  mainPhoto: UserMainImageDTO;
}
