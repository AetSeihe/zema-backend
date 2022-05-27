import { Controller, Get, Param } from '@nestjs/common';
import { CityService } from './city.service';
import { ApiTags, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { AllCitiesDto } from './dto/all-cities.dto';
import { CityDto } from './dto/city.dto';

@ApiTags('City')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer [token]',
})
@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @ApiResponse({
    type: AllCitiesDto,
  })
  @Get('/by-name/:name')
  getCitiesByName(@Param('name') name: string): Promise<AllCitiesDto> {
    return this.cityService.getCityByName(name);
  }

  @ApiResponse({
    type: CityDto,
  })
  @Get('/by-id/:id')
  getCitiesByIde(@Param('id') id: string): Promise<CityDto> {
    return this.cityService.getCityById(id);
  }
}
