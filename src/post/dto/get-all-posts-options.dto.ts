import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetPostsDataDTO {
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
  cityFromId: string;
  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @IsOptional()
  cityToId: string;
}

export class GetPostsOptionsDTO {
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

  @ApiProperty({
    required: false,
  })
  @IsEnum(['DESC', 'ASC'])
  @IsOptional()
  sortBy: string;
}

export class GetPostsDTO {
  @ApiProperty()
  @IsObject()
  data: GetPostsDataDTO;

  @ApiProperty()
  @IsObject()
  options: GetPostsOptionsDTO;
}
