import {
  COMMENT_REPOSITORY,
  LIKE_REPOSITORY,
  POST_FILES_REPOSITORY,
  POST_REPOSITORY,
} from 'src/core/providers-names';
import { Comment } from './enity/Comment.entity';
import { Like } from './enity/Like.entity';
import { Post } from './enity/Post.enity';
import { PostFiles } from './enity/PostFiles.entity';

export const postProviders = [
  {
    provide: POST_REPOSITORY,
    useValue: Post,
  },
  {
    provide: LIKE_REPOSITORY,
    useValue: Like,
  },
  {
    provide: POST_FILES_REPOSITORY,
    useValue: PostFiles,
  },
  {
    provide: COMMENT_REPOSITORY,
    useValue: Comment,
  },
];
