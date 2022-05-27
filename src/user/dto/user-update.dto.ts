import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { EducationEnum } from 'src/types/EducationEnum';
import { GenderEnum } from 'src/types/GenderEnum';
import { ApiProperty } from '@nestjs/swagger';

export class UserUpdateDTO {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  file: any;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    required: false,
  })
  @IsMobilePhone('ru-RU')
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    required: false,
  })
  @IsNumberString()
  @IsOptional()
  mainPhotoId: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    required: false,
  })
  @IsEmail()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  currentCity?: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  birthCity?: number;

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
  @IsString()
  how_can_help?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  need_help?: string;

  @ApiProperty({
    enum: ['null', 'male', 'female'],
    required: false,
  })
  @IsOptional()
  @IsEnum(GenderEnum)
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
  @IsEnum(EducationEnum)
  education?: EducationEnum;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  surname?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  patronomic?: string;
  isUpdateProfile: boolean;
}
