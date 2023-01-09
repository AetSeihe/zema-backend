import { VACANCY_REPOSITORY, VACANCY_SKILLS } from 'src/core/providers-names';
import { Skills } from './entity/skills';
import { Vacancy } from './entity/vacancy.enity';

export const vacancyProviders = [
  {
    provide: VACANCY_REPOSITORY,
    useValue: Vacancy,
  },
  {
    provide: VACANCY_SKILLS,
    useValue: Skills,
  },
];
