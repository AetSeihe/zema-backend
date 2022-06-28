import { RESUME_REPOSITORY } from 'src/core/providers-names';
import { Resume } from './entity/resume.enity';

export const vacancyProviders = [
  {
    provide: RESUME_REPOSITORY,
    useValue: Resume,
  },
];
