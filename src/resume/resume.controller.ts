import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequestJwtPayloadType } from 'src/auth/types/JwtPayload.type';
import { CreateResumeDTO } from './dto/create-resume.dto';
import { ResumeService } from './resume.service';
import { ApiTags, ApiHeader, ApiResponse, ApiBody } from '@nestjs/swagger';
import {
  GetAllResumeDataDTO,
  GetAllResumeDTO,
  GetAllResumeOptionsDTO,
} from './dto/get-all.dto';
import { GetAllResumeResponseDTO } from './dto/get-all-vacancy-dto';
import { GetResumeResponseDTO } from './dto/get-one-resume';

@ApiTags('Resume')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer [token]',
})
@Controller('resume')
export class ResumeController {
  constructor(private readonly vacansyService: ResumeService) {}

  @ApiBody({
    type: GetAllResumeDTO,
  })
  @ApiResponse({
    type: GetAllResumeResponseDTO,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/all')
  getAll(
    @Body('data') data: GetAllResumeDataDTO,
    @Body('options') options: GetAllResumeOptionsDTO,
  ): Promise<GetAllResumeResponseDTO> {
    return this.vacansyService.getAll(data, options);
  }

  @ApiResponse({
    type: GetResumeResponseDTO,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getById(@Param('id') id: number): Promise<GetResumeResponseDTO> {
    return this.vacansyService.getResumeById(+id);
  }

  @ApiResponse({
    type: GetResumeResponseDTO,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/create')
  createResume(
    @Request() req: RequestJwtPayloadType,
    @Body() options: CreateResumeDTO,
  ): Promise<GetResumeResponseDTO> {
    return this.vacansyService.createResume(req.user, options);
  }

  @ApiResponse({
    type: GetResumeResponseDTO,
  })
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  deleteResume(
    @Request() req: RequestJwtPayloadType,
    @Param('id') id: number,
  ): Promise<GetResumeResponseDTO> {
    return this.vacansyService.deleteResumeById(req.user, id);
  }
}
