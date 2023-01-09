import { IsEmail, IsEnum, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EmploymentEnum } from 'src/types/EmploymentEnum';
import { WorkFormat } from 'src/types/WorkFormat';
import { SkillsDTO } from './skills.dto';

export class CreateResumeDTO {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNumber()
  minSalary: number;

  @ApiProperty()
  @IsNumber()
  maxSalary: number;

  @IsEnum(['fulltime', 'partTime'])
  employment: EmploymentEnum;

  @IsEnum(['office', 'remote', 'hybrid'])
  workFormat: WorkFormat;

  @IsString()
  companyName: string;

  @IsString()
  responsibilities: string;

  @IsString()
  descriptionCompany: string;

  @IsString()
  companyUrl: string;

  @IsString()
  requirement: string;
  skills: string[];

  @ApiProperty()
  @IsNumber()
  workExperience: number;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  cityId: number;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  @IsEmail()
  email?: string;
}
