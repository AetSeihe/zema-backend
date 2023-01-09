import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Op } from 'sequelize';
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
import { UserMainImage } from 'src/user/entity/UserMainImage';
import { AddCommentDTO } from './dto/add-comment.dto';
import { CommentResponseDTO } from './dto/comment-reponse.dto';
import { CommentDto } from './dto/comment.dto';
import {
  GetPostsDataDTO,
  GetPostsOptionsDTO,
} from './dto/get-all-posts-options.dto';
import { GetAllPostsDTO } from './dto/get-all-posts.dto';
import { LikeDto } from './dto/like.dto';
import { OnePostDTO } from './dto/one-post.dto';
import { PostCreateDTO } from './dto/post-create.dto';
import { PostDTO } from './dto/post.dto';
import { SetLikeDTO } from './dto/set-like.dto';
import { ToogleLikeDTO } from './dto/toogle-like.dto';
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

  async getAll(
    token: JwtPayloadType,
    { cityToId, cityFromId, ...data }: GetPostsDataDTO,
    options: GetPostsOptionsDTO,
  ) {
    const whereOptions = [];

    if (cityToId) {
      whereOptions.push({
        currentCityId: cityToId,
      });
    }
    if (cityFromId) {
      whereOptions.push({
        birthCityId: cityFromId,
      });
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    const whereSuq: any = {
      where: {},
    };

    if (whereOptions.length) {
      whereSuq.where[Op.and] = whereOptions;
    }

    if (data.userId) {
      whereSuq.where.id = data.userId;
    }

    const allPosts = await this.postRepository.findAll({
      limit: options.limit || 15,
      offset: options.offset || 0,
      order: [['createdAt', options.sortBy || 'DESC']],
      where: {
        [Op.or]: [
          {
            title: {
              [Op.substring]: data.text || '',
            },
          },
          {
            text: {
              [Op.substring]: data.text || '',
            },
          },
        ],
      },
      include: [
        {
          model: User,
          required: true,
          ...whereSuq,
          include: [
            {
              model: UserMainImage,
              attributes: ['imageId'],
              include: [UserImage],
            },
          ],
        },
        PostFiles,
        {
          model: Like,
        },
        Comment,
      ],
    });
    const allPostsDTO = allPosts.map((post) => new PostDTO(post.get(), token));
    return new GetAllPostsDTO({
      message: serviceLocale.findAll,
      posts: allPostsDTO,
    });
  }

  async getById(token: JwtPayloadType, postId: number) {
    const post = await this.postRepository.findByPk(postId, {
      include: [
        PostFiles,
        {
          model: User,
          include: [
            {
              model: UserMainImage,
              include: [UserImage],
            },
          ],
        },
        {
          model: Like,
          include: [
            {
              model: User,
              include: [
                {
                  model: UserMainImage,
                  include: [UserImage],
                },
              ],
            },
          ],
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              include: [
                {
                  model: UserMainImage,
                  include: [UserImage],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!post) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return new OnePostDTO({
      message: serviceLocale.findById,
      post: new PostDTO(post.get(), token),
    });
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

    return new OnePostDTO({
      message: serviceLocale.create,
      post: new PostDTO(post.get()),
    });
  }

  async likeComment(token: JwtPayloadType, options: SetLikeDTO) {
    try {
      const [like, create] = await this.likeRepository.findOrCreate({
        where: {
          userId: token.userId,
          postId: options.postId,
        },
      });

      if (!create) {
        await like.destroy();
      }

      return new ToogleLikeDTO({
        message: create ? serviceLocale.like : serviceLocale.unlike,
        like: new LikeDto(like.get()),
      });
    } catch (e) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
  }

  async addComment(token: JwtPayloadType, options: AddCommentDTO) {
    try {
      const comment = await this.commentRepository.create({
        userId: token.userId,
        postId: options.postId,
        text: options.text,
      });

      const currentComment = await this.commentRepository.findByPk(comment.id, {
        include: [
          {
            model: User,
            include: [
              {
                model: UserMainImage,
                include: [UserImage],
              },
            ],
          },
        ],
      });
      return new CommentResponseDTO({
        message: serviceLocale.comment,
        comment: new CommentDto(currentComment.get()),
      });
    } catch (e) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
  }

  async deleteComment(token: JwtPayloadType, commentId: number) {
    const comment = await this.commentRepository.findByPk(commentId, {
      include: [Post],
    });

    if (comment.userId != token.userId) {
      if (token.userId != comment.post.userId) {
        throw new ForbiddenException();
      }
    }

    await comment.destroy();

    return new CommentResponseDTO({
      message: serviceLocale.delete_comment,
      comment: new CommentDto(comment.get()),
    });
  }
}
