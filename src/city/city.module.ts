import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { cityProviders } from './city.providers';

@Module({
  providers: [CityService, ...cityProviders],
  controllers: [CityController],
  exports: [...cityProviders],
})
export class CityModule {}
