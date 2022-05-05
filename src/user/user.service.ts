import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  USER_IMAGES_REPOSITORY,
  USER_REPOSITORY,
} from 'src/core/providers-names';
import { Op } from 'sequelize';
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

const userServiceLocale = locale.user.service;

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
    @Inject(USER_IMAGES_REPOSITORY)
    private readonly userImagesRepository: typeof UserImage,
    private readonly fileService: FileService,
  ) {}

  async findAll(options: UserGetAllOptionsDTO): Promise<GetAll> {
    options.minAge = options.minAge ?? 0;
    options.maxAge = options.maxAge ?? 999;
    const currentOptions = Object.keys(options).reduce((prev, acc) => {
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
      subQuery: false,
      where: {
        age: {
          [Op.between]: [options.minAge, options.maxAge],
        },

        ...currentOptions,
      },
      include: [UserImage],
    });

    const usersDTO = users.map((user) => new UserDTO(user.get()));

    return new GetAll(userServiceLocale.findAll, usersDTO);
  }

  async findById(userId: number) {
    const candidate = await this.userRepository.findByPk(userId, {
      include: [UserImage],
    });
    if (!candidate) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    return new FindOneDTO(userServiceLocale.findOne, candidate.get());
  }

  async findOneByLogin(login: string) {
    const candidate = await this.userRepository.findOne({
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

    const user = await this.userRepository.create({
      name: signInDTO.name,
      email: signInDTO.email,
      phone: signInDTO.phone,
      password: signInDTO.password,
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
    await Promise.all(
      imagesUrls.map((path) => {
        return this.userImagesRepository.create({
          fileName: path,
          userId: user.id,
        });
      }),
    );

    const currentOptions = Object.keys(options).reduce((prev, acc) => {
      if (options[acc]) {
        prev[acc] = options[acc];
      }
      return prev;
    }, {});

    await user.update(currentOptions);
    return this.findById(user.id);
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
