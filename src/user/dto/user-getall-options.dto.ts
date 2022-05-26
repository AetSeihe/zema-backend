import {
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { EducationEnum } from 'src/types/EducationEnum';
import { GenderEnum } from 'src/types/GenderEnum';

export class UserGetAllOptionsDTO {
  @IsOptional()
  @IsString()
  work?: string;

  @IsOptional()
  @IsNumberString()
  currentCity?: number;

  @IsOptional()
  @IsNumberString()
  birthCity?: number;

  @IsOptional()
  @IsNumberString()
  minAge?: number;

  @IsOptional()
  @IsNumberString()
  maxAge?: number;

  @IsOptional()
  @IsEnum(GenderEnum)
  gender?: GenderEnum;

  @IsOptional()
  @IsEnum(EducationEnum)
  education?: EducationEnum;

  @IsNumberString()
  @IsOptional()
  limit: string;

  @IsNumberString()
  @IsOptional()
  offset: string;
}
