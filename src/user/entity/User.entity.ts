import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Length,
  Model,
  Table,
  Validate,
} from 'sequelize-typescript';
import { City } from 'src/city/entity/City.entity';
import { MIN_PASSWORD_LENGHT } from 'src/core/constants';
import { locale } from 'src/locale';
import { EducationEnum } from 'src/types/EducationEnum';
import { GenderEnum } from 'src/types/GenderEnum';
import { UserImage } from './UserImage.entity';

const userDatabaseLocale = locale.user.database;

@Table({
  modelName: 'User',
})
export class User extends Model<User> {
  // Required
  id: number;

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  phone: string;

  @AllowNull(false)
  @Validate({
    isEmail: {
      msg: userDatabaseLocale.emailError,
    },
  })
  @Column
  email: string;

  @AllowNull(false)
  @Length({
    min: MIN_PASSWORD_LENGHT,
    msg: userDatabaseLocale.passwordError,
  })
  @Column
  password: string;

  @Default(false)
  @AllowNull(false)
  @Column
  isUpdateProfile: boolean;

  // /Required
  @Column
  surname: string;

  @Column
  patronomic: string;

  @ForeignKey(() => City)
  @BelongsTo(() => City, {
    as: 'current_city',
  })
  currentCity: City;

  @ForeignKey(() => City)
  @BelongsTo(() => City, {
    as: 'birth_city',
  })
  birthCity: City;

  @Column
  work: string;

  @Column
  how_can_help: string;

  @Column
  need_help: string;

  @Default('null')
  @Column(DataType.ENUM('null', 'male', 'female'))
  gender: GenderEnum;

  @Column
  interesting: string;

  @Default(18)
  @Column
  age: number;

  @Default('null')
  @Column(
    DataType.ENUM(
      'null',
      'average',
      'secondary_special',
      'unfinished_higher_education',
      'higher',
      'bachelor_degree',
      'master',
      'candidate',
      'doctor',
    ),
  )
  education: EducationEnum;

  @HasMany(() => UserImage)
  images: UserImage[];
}
