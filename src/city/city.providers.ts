import { CITY_REPOSITORY } from 'src/core/providers-names';
import { City } from './entity/City.entity';

export const cityProviders = [
  {
    provide: CITY_REPOSITORY,
    useValue: City,
  },
];
