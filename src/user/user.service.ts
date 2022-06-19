import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CITY_REPOSITORY,
  USER_IMAGES_REPOSITORY,
  USER_MAIN_IMAGE_REPOSITORY,
  USER_REPOSITORY,
} from 'src/core/providers-names';
import { Op } from 'sequelize';
import { hash } from 'bcrypt';
import { UserGetAllOptionsDTO } from './dto/user-getall-options.dto';
import { User } from './entity/User.entity';
import { UserDTO } from './dto/user.dto';
import { GetAll } from './dto/get-all.dto';
import { locale } from 'src/locale';
import { FindOneDTO } from './dto/find-one.dto';
import { UserSignUp } from './dto/user-signup.dto';
import { UserUpdateDTO } from './dto/user-update.dto';
import { JwtPayloadType } from 'src/auth/types/JwtPayload.type';
import { FileService } from 'src/file/file.service';
import { UserImage } from './entity/UserImage.entity';
import { DeletePhotoDTO } from './dto/delete-photo.dto';
import { UserImageDTO } from './dto/user-Image.dto';
import { DeletePhotoRequestDTO } from './dto/delete-photo-request.dto';
import { UserMainImage } from './entity/UserMainImage';
import { City } from 'src/city/entity/City.entity';

const userServiceLocale = locale.user.service;

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
    @Inject(CITY_REPOSITORY) private readonly cityRepository: typeof City,
    @Inject(USER_MAIN_IMAGE_REPOSITORY)
    private readonly userMainImageRepository: typeof UserMainImage,

    @Inject(USER_IMAGES_REPOSITORY)
    private readonly userImagesRepository: typeof UserImage,
    private readonly fileService: FileService,
  ) {}

  async findAll(options: UserGetAllOptionsDTO): Promise<GetAll> {
    options.minAge = +options.minAge || 0;
    options.maxAge = +options.maxAge || 999;

    console.log('!!!options', JSON.stringify(options, null, 2));

    const currentOptions: any = Object.keys(options).reduce((prev, acc) => {
      if (acc == 'limit' || acc == 'offset') {
        return prev;
      }
      if (
        options[acc] &&
        acc !== 'minAge' &&
        acc !== 'maxAge' &&
        acc !== 'work'
      ) {
        prev[acc] = options[acc];
      }
      if (options[acc] && acc === 'work') {
        prev[acc] = {
          [Op.substring]: options.work,
        };
      }

      return prev;
    }, {});

    const users = await this.userRepository.findAll({
      limit: +options.limit || 15,
      offset: +options.offset || 0,
      where: {
        age: {
          [Op.between]: [options.minAge, options.maxAge],
        },

        ...currentOptions,
      },
      include: [
        UserImage,
        {
          model: UserMainImage,
          attributes: ['imageId'],
          include: [UserImage],
        },
      ],
    });

    const usersDTO = users.map((user) => new UserDTO(user.get()));

    return new GetAll(userServiceLocale.findAll, usersDTO);
  }

  async findById(userId: number) {
    const candidate = await this.userRepository.findByPk(userId, {
      include: [
        UserImage,
        {
          model: UserMainImage,
          attributes: ['imageId'],
          include: [UserImage],
        },
      ],
    });
    if (!candidate) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const birthCity = await this.cityRepository.findByPk(candidate.birthCityId);
    const currentCity = await this.cityRepository.findByPk(
      candidate.currentCityId,
    );

    return new FindOneDTO(userServiceLocale.findOne, {
      ...candidate.get(),
      birthCity,
      currentCity,
    });
  }

  async findOneByLogin(login: string) {
    const candidate = await this.userRepository.findOne({
      include: [
        UserImage,
        {
          model: UserMainImage,
          attributes: ['imageId'],
          include: [UserImage],
        },
      ],
      where: {
        [Op.or]: {
          email: login,
          phone: login,
        },
      },
    });

    return candidate;
  }

  async create(signInDTO: UserSignUp) {
    const candidate = await this.userRepository.findOne({
      include: [
        UserImage,
        {
          model: UserMainImage,
          attributes: ['imageId'],
          include: [UserImage],
        },
      ],
      where: {
        [Op.or]: {
          email: signInDTO.email,
          phone: signInDTO.phone,
        },
      },
    });

    if (candidate) {
      throw new BadRequestException(userServiceLocale.userDataExistError);
    }
    const currentPassword = await hash(signInDTO.password, 10);
    const user = await this.userRepository.create({
      name: signInDTO.name,
      email: signInDTO.email,
      phone: signInDTO.phone,
      password: currentPassword,
    });

    return user.get();
  }

  async update(
    userData: JwtPayloadType,
    options: UserUpdateDTO,
    images: Express.Multer.File[],
  ) {
    const user = await this.userRepository.findByPk(userData.userId);

    const candidate = await this.userRepository.findOne({
      where: {
        id: {
          [Op.ne]: userData.userId,
        },
        [Op.or]: {
          email: options.email ?? '',
          phone: options.phone ?? '',
        },
      },
    });

    if (!user) {
      throw new NotFoundException(HttpStatus.NOT_FOUND);
    }

    if (candidate) {
      throw new BadRequestException(userServiceLocale.userDataExistError);
    }
    const imagesUrls = await this.fileService.createFiles(images);

    options.isUpdateProfile = !!imagesUrls.length;
    await Promise.all(
      imagesUrls.map((path) => {
        return this.userImagesRepository.create({
          fileName: path,
          userId: user.id,
        });
      }),
    );

    const currentOptions = Object.keys(options).reduce((prev, acc) => {
      if (options[acc] && acc != 'mainPhotoId') {
        prev[acc] = options[acc];
      }
      return prev;
    }, {});

    if (options.mainPhotoId) {
      await this.userMainImageRepository.findOrCreate({
        where: { userId: user.id, imageId: +options.mainPhotoId },
      });
    }

    await user.update(currentOptions);

    const currentUser = await this.userRepository.findByPk(user.id, {
      include: [
        UserImage,
        {
          model: UserMainImage,
          attributes: ['imageId'],
          include: [UserImage],
        },
      ],
    });

    const birthCity = await this.cityRepository.findByPk(
      currentUser.birthCityId,
    );
    const currentCity = await this.cityRepository.findByPk(
      currentUser.currentCityId,
    );

    return new FindOneDTO(userServiceLocale.update, {
      ...currentUser.get(),
      birthCity,
      currentCity,
    });
  }

  async deleteImage(userData: JwtPayloadType, fileName: DeletePhotoRequestDTO) {
    const image = await this.userImagesRepository.findOne({
      where: {
        userId: userData.userId,
        fileName: fileName.photo_name,
      },
    });

    if (!image) {
      throw new NotFoundException(HttpStatus.NOT_FOUND);
    }
    await this.fileService.deleteFileImage(fileName.photo_name);

    await image.destroy();

    return new DeletePhotoDTO({
      message: userServiceLocale.deletePhoto,
      image: new UserImageDTO(image.get()),
    });
  }
}
