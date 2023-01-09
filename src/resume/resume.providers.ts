import {
  RESUME_REPOSITORY,
  RESUME_SKILLS_REPOSITORY,
} from 'src/core/providers-names';
import { ResumeSkills } from './entity/resume-skills';
import { Resume } from './entity/resume.enity';

export const vacancyProviders = [
  {
    provide: RESUME_REPOSITORY,
    useValue: Resume,
  },
  {
    provide: RESUME_SKILLS_REPOSITORY,
    useValue: ResumeSkills,
  },
];
