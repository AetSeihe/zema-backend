import { VACANCY_REPOSITORY } from 'src/core/providers-names';
import { Vacancy } from './entity/vacancy.enity';

export const vacancyProviders = [
  {
    provide: VACANCY_REPOSITORY,
    useValue: Vacancy,
  },
];
