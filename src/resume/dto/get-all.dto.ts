import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetAllResumeDataDTO {
  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  text: string;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @IsOptional()
  salaryMin: number;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @IsOptional()
  salaryMax: number;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @IsOptional()
  minWorkExpirency: number;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @IsOptional()
  maxWorkExpirency: number;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @IsOptional()
  cityId: number;
}
export class GetAllResumeOptionsDTO {
  @ApiProperty({
    required: false,
  })
  @IsEnum(['DESC', 'ASC'])
  @IsOptional()
  sortBy: string;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @IsOptional()
  limit: number;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @IsOptional()
  offset: number;
}

export class GetAllResumeDTO {
  @ApiProperty()
  @IsObject()
  data: GetAllResumeDataDTO;

  @ApiProperty()
  @IsObject()
  options: GetAllResumeOptionsDTO;
}
