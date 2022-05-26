import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequestJwtPayloadType } from 'src/auth/types/JwtPayload.type';
import { CreateResumeDTO } from './dto/create-resume.dto';
import { VacancyService } from './vacancy.service';

@Controller('vacancy')
export class VacancyController {
  constructor(private readonly vacansyService: VacancyService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  getAll() {
    return this.vacansyService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getById(@Param('id') id: number) {
    return this.vacansyService.getResumeById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  createResume(
    @Request() req: RequestJwtPayloadType,
    @Body() options: CreateResumeDTO,
  ) {
    return this.vacansyService.createResume(req.user, options);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  deleteResume(@Request() req: RequestJwtPayloadType, @Param('id') id: number) {
    return this.vacansyService.deleteResumeById(req.user, id);
  }
}
