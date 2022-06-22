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
import { GetAllVacancyResponseDTO } from './dto/get-all-vacancy-dto';
import {
  GetAllVacancyDataDTO,
  GetAllVacancyOptionsDTO,
} from './dto/get-all.dto';
import { GetVacancyResponseDTO } from './dto/get-one-resume';
import { VacancyDTO } from './dto/vacancy.dto';
import { Vacancy } from './entity/vacancy.enity';

const vacancyLocale = locale.vacancy;
@Injectable()
export class VacancyService {
  constructor(
    @Inject(RESUME_REPOSITORY)
    private readonly resumeRepository: typeof Vacancy,
  ) {}

  async getAll(data: GetAllVacancyDataDTO, options: GetAllVacancyOptionsDTO) {
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
          [Op.between]: [salaryMin || 0, salaryMax || 1000000],
        },
        workExperience: {
          [Op.between]: [minWorkExpirency || 0, maxWorkExpirency || 1000000],
        },
      },
    });

    const currentVacancies = resumes.map(
      (resume) => new VacancyDTO(resume.get()),
    );

    return new GetAllVacancyResponseDTO({
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

    return new GetVacancyResponseDTO({
      message: vacancyLocale.byId,
      vacancy: new VacancyDTO(vacancy.get()),
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

    return new GetVacancyResponseDTO({
      message: vacancyLocale.create,
      vacancy: new VacancyDTO(vacancy.get()),
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

    return new GetVacancyResponseDTO({
      message: vacancyLocale.delete,
      vacancy: new VacancyDTO(vacancy.get()),
    });
  }
}
