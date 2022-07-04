import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Op } from 'sequelize';
import { JwtPayloadType } from 'src/auth/types/JwtPayload.type';
import { City } from 'src/city/entity/City.entity';
import { RESUME_REPOSITORY } from 'src/core/providers-names';
import { locale } from 'src/locale';
import { User } from 'src/user/entity/User.entity';
import { UserImage } from 'src/user/entity/UserImage.entity';
import { UserMainImage } from 'src/user/entity/UserMainImage';
import { CreateResumeDTO } from './dto/create-resume.dto';
import { GetAllResumeResponseDTO } from './dto/get-all-vacancy-dto';
import { GetAllResumeDataDTO, GetAllResumeOptionsDTO } from './dto/get-all.dto';
import { GetResumeResponseDTO } from './dto/get-one-resume';
import { ResumeDTO } from './dto/resume.dto';
import { Resume } from './entity/resume.enity';

const vacancyLocale = locale.vacancy;
@Injectable()
export class ResumeService {
  constructor(
    @Inject(RESUME_REPOSITORY)
    private readonly resumeRepository: typeof Resume,
  ) {}

  async getAll(data: GetAllResumeDataDTO, options: GetAllResumeOptionsDTO) {
    const {
      text,
      salaryMin,
      salaryMax,
      minWorkExpirency,
      maxWorkExpirency,
      ...currentData
    } = data;

    const resumes = await this.resumeRepository.findAll({
      limit: options.limit || 15,
      offset: options.offset || 0,
      order: [['createdAt', options.sortBy || 'DESC']],
      include: [
        City,
        {
          model: User,
          include: [
            {
              model: UserMainImage,
              include: [UserImage],
            },
          ],
        },
      ],
      where: {
        ...currentData,
        [Op.or]: [
          {
            title: {
              [Op.substring]: text || '',
            },
          },
          {
            description: {
              [Op.substring]: text || '',
            },
          },
        ],
        salary: {
          [Op.between]: [salaryMin || 0, salaryMax || 9999999999999],
        },
        workExperience: {
          [Op.between]: [minWorkExpirency || 0, maxWorkExpirency || 99],
        },
      },
    });

    const currentVacancies = resumes.map(
      (resume) => new ResumeDTO(resume.get()),
    );

    return new GetAllResumeResponseDTO({
      message: vacancyLocale.findAll,
      vacancies: currentVacancies,
    });
  }

  async getResumeById(resumeId: number) {
    const vacancy = await this.resumeRepository.findByPk(resumeId, {
      include: [
        City,
        {
          model: User,
          include: [
            {
              model: UserMainImage,
              include: [UserImage],
            },
          ],
        },
      ],
    });

    if (!vacancy) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return new GetResumeResponseDTO({
      message: vacancyLocale.byId,
      vacancy: new ResumeDTO(vacancy.get()),
    });
  }
  async createResume(token: JwtPayloadType, options: CreateResumeDTO) {
    const vacancy = await this.resumeRepository.create({
      userId: token.userId,
      title: options.title,
      description: options.description,
      workExperience: +options.workExperience,
      cityId: options.cityId,
      phone: options.phone ?? '',
      email: options.email ?? '',
      salary: +options.salary,
    });

    return new GetResumeResponseDTO({
      message: vacancyLocale.create,
      vacancy: new ResumeDTO(vacancy.get()),
    });
  }

  async deleteResumeById(res: JwtPayloadType, resumeId: number) {
    const vacancy = await this.resumeRepository.findByPk(resumeId);
    if (!vacancy) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    if (vacancy.userId != res.userId) {
      throw new ForbiddenException();
    }

    await vacancy.destroy();

    return new GetResumeResponseDTO({
      message: vacancyLocale.delete,
      vacancy: new ResumeDTO(vacancy.get()),
    });
  }
}
