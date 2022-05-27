import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './User.entity';
import { UserMainImage } from './UserMainImage';

@Table({
  modelName: 'user_image',
})
export class UserImage extends Model {
  id: number;

  @ForeignKey(() => User)
  @BelongsTo(() => User, {
    as: 'user_id',
  })
  userId: number;

  @HasOne(() => UserMainImage)
  mainPhoto: UserMainImage;

  @AllowNull(false)
  @Column
  fileName: string;
}
