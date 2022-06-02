import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/user/entity/User.entity';
import { Post } from './Post.enity';

@Table({
  modelName: 'comment',
})
export class Comment extends Model<Comment> {
  @ForeignKey(() => User)
  @BelongsTo(() => User, {
    as: 'user',
  })
  userId: number;
  user: User;

  @ForeignKey(() => Post)
  @BelongsTo(() => Post, {
    as: 'post',
  })
  postId: number;
  post: Post;

  @Column(DataType.TEXT('long'))
  text: string;
}
