import { PostDTO } from './post.dto';

export class GetAllPostsDTO {
  constructor(partial: Partial<GetAllPostsDTO>) {
    Object.assign(this, partial);
  }

  message: string;
  posts: PostDTO[];
}
