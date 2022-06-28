import { IsEmail, IsMobilePhone, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  @IsMobilePhone('ru-RU')
  phone?: string;

  @ApiProperty()
  @IsEmail()
  email?: string;
}
