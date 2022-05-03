import { Exclude } from 'class-transformer';
import { City } from 'src/city/entity/City.entity';
import { EducationEnum } from 'src/types/EducationEnum';
import { GenderEnum } from 'src/types/GenderEnum';
import { User } from '../entity/User.entity';
import { UserImage } from '../entity/UserImage.entity';
import { UserImageDTO } from './user-Image.dto';

export class UserDTO {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
    this.images =
      partial.images?.map((image) => new UserImageDTO(image.get())) || [];
  }

  id: number;
  name: string;
  phone: string;
  email: string;
  age: number;

  @Exclude()
  password: string;

  surname: string;
  patronomic: string;
  currentCity: City;
  birthCity: City;
  work: string;
  how_can_help: string;
  need_help: string;
  gender: GenderEnum;
  education: EducationEnum;

  images: UserImageDTO[];

  @Exclude()
  updatedAt: string;

  @Exclude()
  createdAt: string;
}
