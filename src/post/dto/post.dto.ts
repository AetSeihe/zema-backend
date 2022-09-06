import { Exclude } from 'class-transformer';
import { UserDTO } from 'src/user/dto/user.dto';
import { Like } from '../enity/Like.entity';
import { Post } from '../enity/Post.enity';
import { PostFiles } from '../enity/PostFiles.entity';
import { ApiProperty } from '@nestjs/swagger';
import { PostFileDTO } from './post-files.dto';
import { LikeDto } from './like.dto';
import { JwtPayloadType } from 'src/auth/types/JwtPayload.type';

export class PostDTO {
  constructor(partial: Partial<Post>, token?: JwtPayloadType) {
    Object.assign(this, partial);

    this.user = partial.user && new UserDTO(partial.user.get());
    this.likeCount = partial.likes?.length;
    this.isLike =
      token && partial.likes
        ? partial.likes.some((like) => like.get().userId == token.userId)
        : false;
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  user: UserDTO;

  @ApiProperty({ type: [LikeDto] })
  likes: Like[];

  @ApiProperty()
  likeCount: number;

  @ApiProperty()
  isLike: boolean;

  @ApiProperty({ type: [PostFileDTO] })
  postFiles: PostFiles[];

  @ApiProperty()
  @Exclude()
  userId: number;

  @ApiProperty()
  @Exclude()
  updatedAt: Date;
}
