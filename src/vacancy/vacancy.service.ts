import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtPayloadType } from 'src/auth/types/JwtPayload.type';
import { RESUME_REPOSITORY } from 'src/core/providers-names';
import { User } from 'src/user/entity/User.entity';
import { UserImage } from 'src/user/entity/UserImage.entity';
import { CreateResumeDTO } from './dto/create-resume.dto';
import { Resume } from './entity/resume.enity';

@Injectable()
export class VacancyService {
  constructor(
    @Inject(RESUME_REPOSITORY) private readonly resumeRepository: typeof Resume,
  ) {}

  async getAll() {
    const resumes = await this.resumeRepository.findAll();

    return resumes;
  }

  async getResumeById(resumeId: number) {
    const resume = await this.resumeRepository.findByPk(resumeId, {
      include: [
        {
          model: User,
          include: [UserImage],
        },
      ],
    });

    if (!resume) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return resume;
  }
  async createResume(token: JwtPayloadType, options: CreateResumeDTO) {
    console.log('!!! token ', token);
    console.log('!!! options ', options);

    const resume = await this.resumeRepository.create({
      userId: token.userId,
      title: options.title,
      description: options.description,
      workExperience: options.workExperience,
      citizenship: options.citizenship,
      experience: options.experience,
      phone: options.phone ?? '',
      email: options.email ?? '',
    });

    return resume;
  }

  async deleteResumeById(res: JwtPayloadType, resumeId: number) {
    const resume = await this.resumeRepository.findByPk(resumeId);
    if (!resume) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    if (resume.userId != res.userId) {
      throw new ForbiddenException();
    }

    await resume.destroy();

    return resume;
  }
}
