import { IsEmail, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResumeDTO {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNumber()
  salary: number;

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
