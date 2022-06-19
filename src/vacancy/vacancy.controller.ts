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
import { VacancyService } from './vacancy.service';
import { ApiTags, ApiHeader, ApiResponse, ApiBody } from '@nestjs/swagger';
import {
  GetAllVacancyDataDTO,
  GetAllVacancyDTO,
  GetAllVacancyOptionsDTO,
} from './dto/get-all.dto';
import { GetAllVacancyResponseDTO } from './dto/get-all-vacancy-dto';
import { GetVacancyResponseDTO } from './dto/get-one-resume';

@ApiTags('Vacancy')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer [token]',
})
@Controller('vacancy')
export class VacancyController {
  constructor(private readonly vacansyService: VacancyService) {}

  @ApiBody({
    type: GetAllVacancyDTO,
  })
  @ApiResponse({
    type: GetAllVacancyResponseDTO,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/all')
  getAll(
    @Body('data') data: GetAllVacancyDataDTO,
    @Body('options') options: GetAllVacancyOptionsDTO,
  ): Promise<GetAllVacancyResponseDTO> {
    return this.vacansyService.getAll(data, options);
  }

  @ApiResponse({
    type: GetVacancyResponseDTO,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getById(@Param('id') id: number): Promise<GetVacancyResponseDTO> {
    return this.vacansyService.getResumeById(+id);
  }

  @ApiResponse({
    type: GetVacancyResponseDTO,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/create')
  createResume(
    @Request() req: RequestJwtPayloadType,
    @Body() options: CreateResumeDTO,
  ): Promise<GetVacancyResponseDTO> {
    return this.vacansyService.createResume(req.user, options);
  }

  @ApiResponse({
    type: GetVacancyResponseDTO,
  })
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  deleteResume(
    @Request() req: RequestJwtPayloadType,
    @Param('id') id: number,
  ): Promise<GetVacancyResponseDTO> {
    return this.vacansyService.deleteResumeById(req.user, id);
  }
}
