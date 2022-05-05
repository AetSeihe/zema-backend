import { Module } from '@nestjs/common';
import { VacancyController } from './vacancy.controller';
import { vacancyProviders } from './vacancy.providers';
import { VacancyService } from './vacancy.service';

@Module({
  controllers: [VacancyController],
  providers: [VacancyService, ...vacancyProviders],
})
export class VacancyModule {}
