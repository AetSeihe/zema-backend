import {
  IsEmail,
  IsMobilePhone,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateResumeDTO {
  @IsString()
  title: string;

  @IsNumber()
  salary: string;

  @IsNumber()
  workExperience: number;

  @IsString()
  description: string;
  @IsString()
  citizenship: string;
  @IsString()
  experience: string;

  @IsOptional()
  @IsMobilePhone('ru-RU')
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
