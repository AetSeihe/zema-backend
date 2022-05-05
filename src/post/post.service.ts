import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import sequelize from 'sequelize';
import { JwtPayloadType } from 'src/auth/types/JwtPayload.type';
import {
  COMMENT_REPOSITORY,
  LIKE_REPOSITORY,
  POST_FILES_REPOSITORY,
  POST_REPOSITORY,
} from 'src/core/providers-names';
import { FileService } from 'src/file/file.service';
import { locale } from 'src/locale';
import { User } from 'src/user/entity/User.entity';
import { UserImage } from 'src/user/entity/UserImage.entity';
import { AddCommentDTO } from './dto/add-comment.dto';
import { CommentDto } from './dto/comment.dto';
import { GetAllPostsDTO } from './dto/get-all-posts.dto';
import { LikeDto } from './dto/like.dto';
import { PostCreateDTO } from './dto/post-create.dto';
import { PostDTO } from './dto/post.dto';
import { SetLikeDTO } from './dto/set-like.dto';
import { Comment } from './enity/Comment.entity';
import { Like } from './enity/Like.entity';
import { Post } from './enity/Post.enity';
import { PostFiles } from './enity/PostFiles.entity';

const serviceLocale = locale.post.service;

@Injectable()
export class PostService {
  constructor(
    @Inject(POST_REPOSITORY) private readonly postRepository: typeof Post,
    @Inject(LIKE_REPOSITORY) private readonly likeRepository: typeof Like,
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: typeof Comment,

    @Inject(POST_FILES_REPOSITORY)
    private readonly postFilesRepository: typeof PostFiles,

    private readonly fileService: FileService,
  ) {}

  async getAll() {
    const allPosts = await this.postRepository.findAll({
      include: [
        {
          model: User,
          include: [UserImage],
        },
        PostFiles,
        Like,
        Comment,
      ],
    });
    const allPostsDTO = allPosts.map((post) => new PostDTO(post.get()));
    return new GetAllPostsDTO({
      message: serviceLocale.findAll,
      posts: allPostsDTO,
    });
  }

  async getById(token: JwtPayloadType, postId: number) {
    const post = await this.postRepository.findByPk(postId, {
      include: [
        {
          model: User,
          include: [UserImage],
        },
        {
          model: Like,
          include: [
            {
              model: User,
              include: [UserImage],
            },
          ],
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              include: [UserImage],
            },
          ],
        },
      ],
    });

    if (!post) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return new PostDTO(post.get());
  }

  async create(
    token: JwtPayloadType,
    options: PostCreateDTO,
    files: Express.Multer.File[],
  ) {
    const [post, created] = await this.postRepository.findOrCreate({
      where: {
        userId: token.userId,
        title: options.title,
        text: options.text,
      },
      include: [Like, PostFiles],
    });
    if (created) {
      const filesUrl = await this.fileService.createFiles(files);
      const repoFiles = await Promise.all(
        filesUrl.map((fileName) =>
          this.postFilesRepository.create({
            postId: post.id,
            fileName,
          }),
        ),
      );
      post.setDataValue('postFiles', repoFiles);
    }

    post.setDataValue('likes', []);

    return new PostDTO(post.get());
  }

  async likeComment(token: JwtPayloadType, options: SetLikeDTO) {
    const [like, create] = await this.likeRepository.findOrCreate({
      where: {
        userId: token.userId,
        postId: options.postId,
      },
    });

    if (!create) {
      await like.destroy();
    }

    return new LikeDto(like);
  }

  async addComment(token: JwtPayloadType, options: AddCommentDTO) {
    const comment = await this.commentRepository.create({
      userId: token.userId,
      postId: options.postId,
      text: options.text,
    });

    return new CommentDto(comment.get());
  }

  async deleteComment(token: JwtPayloadType, commentId: number) {
    const comment = await this.commentRepository.findByPk(commentId);
    if (comment.userId != token.userId) {
      throw new ForbiddenException();
    }
    await comment.destroy();
    return new CommentDto(comment.get());
  }
}
