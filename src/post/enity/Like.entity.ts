import { BelongsTo, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from 'src/user/entity/User.entity';
import { Post } from './Post.enity';

@Table({
  modelName: 'like',
})
export class Like extends Model<Like> {
  @ForeignKey(() => Post)
  @BelongsTo(() => Post, {
    as: 'post',
  })
  postId: number;
  post: Post;

  @ForeignKey(() => User)
  @BelongsTo(() => User, {
    as: 'user',
  })
  userId: number;
  user: User;
}
