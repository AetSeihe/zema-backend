import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Op } from 'sequelize';
import { CITY_REPOSITORY } from 'src/core/providers-names';
import { AllCitiesDto } from './dto/all-cities.dto';
import { CityDto } from './dto/city.dto';
import { City } from './entity/City.entity';

@Injectable()
export class CityService {
  constructor(
    @Inject(CITY_REPOSITORY) private readonly cityRepository: typeof City,
  ) {}
  async getCityByName(name: string) {
    const cities = await this.cityRepository.findAll({
      where: {
        title: {
          [Op.substring]: name || '',
        },
      },
    });

    return new AllCitiesDto({
      message: 'Все найденные города',
      cities: cities,
    });
  }

  async getCityById(id: string) {
    const cities = await this.cityRepository.findByPk(+id);

    if (!cities) {
      throw new NotFoundException(HttpStatus.NOT_FOUND);
    }

    return new CityDto(cities);
  }
}
