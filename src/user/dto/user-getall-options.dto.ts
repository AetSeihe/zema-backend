import {
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { EducationEnum } from 'src/types/EducationEnum';
import { GenderEnum } from 'src/types/GenderEnum';
import { ApiProperty } from '@nestjs/swagger';

export class UserGetAllOptionsDTO {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  work?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  currentCityId?: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  birthCityId?: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  minAge?: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  maxAge?: number;

  @ApiProperty({
    enum: ['null', 'male', 'female'],
    required: false,
  })
  @IsOptional()
  gender?: GenderEnum;

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
  @IsOptional()
  education?: EducationEnum;

  @ApiProperty({
    required: false,
    default: 15,
  })
  @IsNumberString()
  @IsOptional()
  limit: string;

  @ApiProperty({
    required: false,
    default: 0,
  })
  @IsNumberString()
  @IsOptional()
  offset: string;
}
