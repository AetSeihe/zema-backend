import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequestJwtPayloadType } from 'src/auth/types/JwtPayload.type';
import { AddCommentDTO } from './dto/add-comment.dto';
import { PostCreateDTO } from './dto/post-create.dto';
import { SetLikeDTO } from './dto/set-like.dto';
import { PostService } from './post.service';
import {
  ApiTags,
  ApiHeader,
  ApiBody,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import {
  GetPostsDataDTO,
  GetPostsDTO,
  GetPostsOptionsDTO,
} from './dto/get-all-posts-options.dto';
import { GetAllPostsDTO } from './dto/get-all-posts.dto';
import { OnePostDTO } from './dto/one-post.dto';
import { ToogleLikeDTO } from './dto/toogle-like.dto';
import { CommentResponseDTO } from './dto/comment-reponse.dto';

@ApiTags('Posts')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer [token]',
})
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiBody({
    type: GetPostsDTO,
  })
  @ApiResponse({
    type: GetAllPostsDTO,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/all')
  getAll(
    @Request() res: RequestJwtPayloadType,
    @Body('data') data: GetPostsDataDTO,
    @Body('options') options: GetPostsOptionsDTO,
  ): Promise<GetAllPostsDTO> {
    return this.postService.getAll(res.user, data, options);
  }

  @ApiResponse({
    type: OnePostDTO,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getPostById(
    @Request() res: RequestJwtPayloadType,
    @Param('id') id: number,
  ): Promise<OnePostDTO> {
    return this.postService.getById(res.user, id);
  }

  @ApiBody({
    type: PostCreateDTO,
  })
  @ApiResponse({
    type: OnePostDTO,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async create(
    @Request() res: RequestJwtPayloadType,
    @UploadedFiles() files: Express.Multer.File[] = [],
    @Body() options: PostCreateDTO,
  ): Promise<OnePostDTO> {
    return await this.postService.create(res.user, options, files);
  }

  @ApiBody({
    type: SetLikeDTO,
  })
  @ApiResponse({
    type: ToogleLikeDTO,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/like')
  like(
    @Request() res: RequestJwtPayloadType,
    @Body() options: SetLikeDTO,
  ): Promise<ToogleLikeDTO> {
    return this.postService.likeComment(res.user, options);
  }

  @ApiBody({
    type: AddCommentDTO,
  })
  @ApiResponse({
    type: CommentResponseDTO,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/comment')
  addComment(
    @Request() res: RequestJwtPayloadType,
    @Body() options: AddCommentDTO,
  ): Promise<CommentResponseDTO> {
    return this.postService.addComment(res.user, options);
  }

  @ApiResponse({
    type: CommentResponseDTO,
  })
  @UseGuards(JwtAuthGuard)
  @Delete('/comment/:id')
  deleteComment(
    @Request() res: RequestJwtPayloadType,
    @Param('id') id: number,
  ): Promise<CommentResponseDTO> {
    return this.postService.deleteComment(res.user, id);
  }
}
