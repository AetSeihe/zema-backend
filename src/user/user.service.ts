import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CITY_REPOSITORY,
  USER_BANNED,
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
import { GetUsersByCordsDTO } from './dto/UsersByCords.dto';
import { UserBanned } from './entity/user-banned.entity';
import { FriendService } from 'src/friend/friend.service';

const userServiceLocale = locale.user.service;

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
    @Inject(CITY_REPOSITORY) private readonly cityRepository: typeof City,
    @Inject(USER_MAIN_IMAGE_REPOSITORY)
    private readonly userMainImageRepository: typeof UserMainImage,
    @Inject(USER_BANNED)
    private readonly userBannedRepository: typeof UserBanned,
    @Inject(USER_IMAGES_REPOSITORY)
    private readonly userImagesRepository: typeof UserImage,
    private readonly fileService: FileService,
  ) {}

  async getUsersByCords(
    token: JwtPayloadType,
    { options, data }: GetUsersByCordsDTO,
  ) {
    const { rows, count } = await this.userRepository.findAndCountAll({
      limit: options.limit,
      where: {
        [Op.and]: {
          id: {
            [Op.not]: token.userId,
          },
          cordX: {
            [Op.and]: {
              [Op.lte]: data.startCordX,
              [Op.gte]: data.startCordY,
            },
          },
          cordY: {
            [Op.and]: {
              [Op.gte]: data.finishCordX,
              [Op.lte]: data.finishCordY,
            },
          },
        },
      },
      include: [
        {
          model: UserMainImage,
          include: [UserImage],
        },
        {
          model: City,
          as: 'birthCity',
        },
      ],
    });

    const currentUsers = rows.map((user) => new UserDTO(user.get()));
    return new GetAll(
      'Все пользователи в заданном диапозоне',
      currentUsers,
      count,
    );
  }

  async findAll(options: UserGetAllOptionsDTO): Promise<GetAll> {
    options.minAge = +options.minAge || 0;
    options.maxAge = +options.maxAge || 999;

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

  async findById(token: JwtPayloadType, userId: number) {
    const candidate = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      include: [
        UserImage,
        {
          model: UserMainImage,
          attributes: ['imageId'],
          include: [UserImage],
        },
        {
          model: UserBanned,
          required: false,
          where: {
            [Op.or]: [
              {
                userId: userId,
                bannedUserId: token.userId,
              },
              {
                userId: token.userId,
                bannedUserId: userId,
              },
            ],
          },
        },
      ],
    });
    if (!candidate || candidate.banned.length) {
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
    const currentPassword = await hash(signInDTO.password, 10);

    const [user, created] = await this.userRepository.findOrCreate({
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
      defaults: {
        name: signInDTO.name,
        email: signInDTO.email,
        phone: signInDTO.phone,
        password: currentPassword,
      },
    });

    if (!created) {
      throw new BadRequestException(userServiceLocale.userDataExistError);
    }
    return user.get();
  }

  async update(
    userData: JwtPayloadType,
    { id, mainPhotoId, password, ...options }: UserUpdateDTO,
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

    const currentOptions: any = Object.keys(options).reduce((prev, acc) => {
      if (options[acc] && acc != 'mainPhotoId') {
        prev[acc] = options[acc];
      }
      if (acc === 'cordX' || acc === 'cordY') {
        prev[acc] = options[acc] == 0 ? null : options[acc];
      }
      return prev;
    }, {});

    if (password) {
      currentOptions.password = await hash(password, 10);
    }

    if (mainPhotoId) {
      const photo = await this.userImagesRepository.findByPk(+mainPhotoId);
      if (photo) {
        const [mainPhoto] = await this.userMainImageRepository.findOrCreate({
          where: { userId: user.id },
        });
        mainPhoto?.update({
          imageId: photo.id,
        });
      }
    }
    await user.update({ ...currentOptions });

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

    const mainPhoto = await this.userMainImageRepository.findOne({
      where: {
        userId: userData.userId,
      },
    });

    if (mainPhoto?.imageId == image.id) {
      await mainPhoto.destroy();
    }

    await this.fileService.deleteFileImage(fileName.photo_name);

    await image.destroy();

    return new DeletePhotoDTO({
      message: userServiceLocale.deletePhoto,
      image: new UserImageDTO(image.get()),
    });
  }

  async banUser(token: JwtPayloadType, userId: string) {
    await this.userBannedRepository.findOrCreate({
      where: {
        userId: token.userId,
        bannedUserId: +userId,
      },
    });
    return true;
  }

  async unBan(token: JwtPayloadType, userId: string) {
    try {
      const candidate = await this.userBannedRepository.findOne({
        where: {
          userId: token.userId,
          bannedUserId: +userId,
        },
      });
      if (candidate) {
        await candidate.destroy();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  async getAllBannedUser(token: JwtPayloadType) {
    const banned = await this.userBannedRepository.findAll({
      where: {
        userId: token.userId,
      },
      include: [
        {
          model: User,
          as: 'bannedUser',
          include: [
            {
              model: UserMainImage,
              include: [UserImage],
            },
          ],
        },
      ],
    });

    return banned.map((ban) => new UserDTO(ban.bannedUser.get()));
  }
}
