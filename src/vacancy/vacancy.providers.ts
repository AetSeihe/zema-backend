import { RESUME_REPOSITORY } from 'src/core/providers-names';
import { Vacancy } from './entity/vacancy.enity';

export const vacancyProviders = [
  {
    provide: RESUME_REPOSITORY,
    useValue: Vacancy,
  },
];
