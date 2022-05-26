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

export class UserUpdateDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsMobilePhone('ru-RU')
  @IsOptional()
  @IsString()
  phone?: string;

  @IsNumberString()
  @IsOptional()
  mainPhotoId: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsEmail()
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsNumberString()
  currentCity?: number;

  @IsOptional()
  @IsNumberString()
  birthCity?: number;

  @IsOptional()
  @IsString()
  work?: string;

  @IsOptional()
  @IsString()
  how_can_help?: string;

  @IsOptional()
  @IsString()
  need_help?: string;

  @IsOptional()
  @IsEnum(GenderEnum)
  gender?: GenderEnum;

  @IsOptional()
  @IsEnum(EducationEnum)
  education?: EducationEnum;

  @IsOptional()
  @IsString()
  surname?: string;

  @IsOptional()
  @IsString()
  patronomic?: string;
  isUpdateProfile: boolean;
}
