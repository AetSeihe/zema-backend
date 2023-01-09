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
import { VACANCY_REPOSITORY, VACANCY_SKILLS } from 'src/core/providers-names';
import { locale } from 'src/locale';
import { GetResumeResponseDTO } from 'src/resume/dto/get-one-resume';
import { User } from 'src/user/entity/User.entity';
import { UserImage } from 'src/user/entity/UserImage.entity';
import { UserMainImage } from 'src/user/entity/UserMainImage';
import { CreateResumeDTO } from './dto/create-resume.dto';
import { GetAllVacancyResponseDTO } from './dto/get-all-vacancy-dto';
import {
  GetAllVacancyDataDTO,
  GetAllVacancyOptionsDTO,
} from './dto/get-all.dto';
import { VacancyDTO } from './dto/vacancy.dto';
import { Skills } from './entity/skills';
import { Vacancy } from './entity/vacancy.enity';

const vacancyLocale = locale.vacancy;
@Injectable()
export class VacancyService {
  constructor(
    @Inject(VACANCY_REPOSITORY)
    private readonly vacancyRepository: typeof Vacancy,
    @Inject(VACANCY_SKILLS)
    private readonly skillsRepository: typeof Skills,
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

    const vacancys = await this.vacancyRepository.findAll({
      limit: options.limit || 15,
      offset: options.offset || 0,
      order: [['createdAt', options.sortBy || 'DESC']],
      include: [
        City,
        Skills,
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
        minSalary: {
          [Op.between]: [salaryMin || 0, salaryMax || 1000000],
        },
        workExperience: {
          [Op.between]: [minWorkExpirency || 0, maxWorkExpirency || 1000000],
        },
      },
    });

    const currentVacancies = vacancys.map(
      (vacancy) => new VacancyDTO(vacancy.get()),
    );

    return new GetAllVacancyResponseDTO({
      message: vacancyLocale.findAll,
      vacancies: currentVacancies,
    });
  }

  async getVacancyById(vacancyId: number) {
    const vacancy = await this.vacancyRepository.findByPk(vacancyId, {
      include: [
        City,
        Skills,
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
      vacancy: new VacancyDTO(vacancy.get()),
    });
  }
  async createVacancy(
    token: JwtPayloadType,
    { skills, ...options }: CreateResumeDTO,
  ) {
    const vacancy = await this.vacancyRepository.create({
      userId: token.userId,
      title: options.title,
      description: options.description,
      workExperience: +options.workExperience,
      cityId: options.cityId,
      phone: options.phone ?? '',
      email: options.email ?? '',
      minSalary: +options.minSalary,
      maxSalary: +options.maxSalary,
      employment: options.employment,
      workFormat: options.workFormat,
      companyName: options.companyName,
      descriptionCompany: options.descriptionCompany,
      companyUrl: options.companyUrl,
      requirement: options.requirement,
      responsibilities: options.responsibilities,
    });

    skills.forEach((item) => {
      this.skillsRepository.create({
        title: item,
        vacancyId: vacancy.id,
      });
    });

    return new GetResumeResponseDTO({
      message: vacancyLocale.create,
      vacancy: new VacancyDTO(vacancy.get()),
    });
  }

  async deleteVacancyById(res: JwtPayloadType, vacancyId: number) {
    const vacancy = await this.vacancyRepository.findByPk(vacancyId);
    if (!vacancy) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    if (vacancy.userId != res.userId) {
      throw new ForbiddenException();
    }

    await vacancy.destroy();

    return new GetResumeResponseDTO({
      message: vacancyLocale.delete,
      vacancy: new VacancyDTO(vacancy.get()),
    });
  }
}
