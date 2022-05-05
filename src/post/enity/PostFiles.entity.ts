import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Post } from './Post.enity';

@Table({
  modelName: 'post_files',
})
export class PostFiles extends Model<PostFiles> {
  @ForeignKey(() => Post)
  @BelongsTo(() => Post, {
    as: 'post',
  })
  postId: number;

  @Column
  fileName: string;
}
