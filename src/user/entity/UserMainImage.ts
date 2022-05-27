import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './User.entity';
import { UserImage } from './UserImage.entity';

@Table({
  modelName: 'user-main-image',
})
export class UserMainImage extends Model<UserMainImage> {
  @BelongsTo(() => User, {
    as: 'user',
  })
  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => UserImage, {
    as: 'image',
  })
  @ForeignKey(() => UserImage)
  @Column
  imageId: number;
}
