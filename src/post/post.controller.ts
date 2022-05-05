import {
  Body,
  ClassSerializerInterceptor,
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

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  getAll() {
    return this.postService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getPostById(@Request() res: RequestJwtPayloadType, @Param('id') id: number) {
    return this.postService.getById(res.user, id);
  }

  @UseInterceptors(FilesInterceptor('files'))
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async create(
    @Request() res: RequestJwtPayloadType,
    @UploadedFiles() files: Express.Multer.File[] = [],
    @Body() options: PostCreateDTO,
  ) {
    return await this.postService.create(res.user, options, files);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/like')
  like(@Request() res: RequestJwtPayloadType, @Body() options: SetLikeDTO) {
    return this.postService.likeComment(res.user, options);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/comment')
  addComment(
    @Request() res: RequestJwtPayloadType,
    @Body() options: AddCommentDTO,
  ) {
    return this.postService.addComment(res.user, options);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/comment/:id')
  deleteComment(
    @Request() res: RequestJwtPayloadType,
    @Param('id') id: number,
  ) {
    return this.postService.deleteComment(res.user, id);
  }
}
