import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  NotNull,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/user/entity/User.entity';
import { Comment } from './Comment.entity';
import { Like } from './Like.entity';
import { PostFiles } from './PostFiles.entity';

@Table({
  modelName: 'post',
})
export class Post extends Model<Post> {
  @ForeignKey(() => User)
  @BelongsTo(() => User, {
    as: 'user',
  })
  userId: number;
  user: User;

  @Column
  title: string;

  @Column
  text: string;

  @HasMany(() => Like)
  likes: Like[];

  @HasMany(() => PostFiles)
  postFiles: PostFiles[];

  @HasMany(() => Comment)
  comments: Comment[];
}
