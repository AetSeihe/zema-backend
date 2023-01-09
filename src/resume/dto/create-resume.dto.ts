import { IsEmail, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EmploymentEnum } from 'src/types/EmploymentEnum';
import { WorkFormat } from 'src/types/WorkFormat';

export class CreateResumeDTO {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNumber()
  salary: string;

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

  skills: string[];

  employment: EmploymentEnum;
  workFormat: WorkFormat;
}
