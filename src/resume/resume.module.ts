import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { vacancyProviders } from './resume.providers';
import { ResumeService } from './resume.service';

@Module({
  controllers: [ResumeController],
  providers: [ResumeService, ...vacancyProviders],
})
export class ResumeModule {}
