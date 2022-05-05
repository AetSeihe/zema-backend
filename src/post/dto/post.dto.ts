import { Exclude } from 'class-transformer';
import { UserDTO } from 'src/user/dto/user.dto';
import { Like } from '../enity/Like.entity';
import { Post } from '../enity/Post.enity';
import { PostFiles } from '../enity/PostFiles.entity';

export class PostDTO {
  constructor(partial: Partial<Post>) {
    Object.assign(this, partial);

    this.user = partial.user && new UserDTO(partial.user.get());
  }

  message: string;
  id: number;
  title: string;
  text: string;
  createdAt: Date;
  user: UserDTO;
  likes: Like[];
  postFiles: PostFiles[];

  @Exclude()
  userId: number;
  @Exclude()
  updatedAt: Date;
}
