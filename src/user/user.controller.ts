import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequestJwtPayloadType } from 'src/auth/types/JwtPayload.type';
import { DeletePhotoRequestDTO } from './dto/delete-photo-request.dto';
import { UserGetAllOptionsDTO } from './dto/user-getall-options.dto';
import { UserUpdateDTO } from './dto/user-update.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('/all')
  getAll(@Query() options: UserGetAllOptionsDTO) {
    return this.userService.findAll(options);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getById(@Param('id') id: number) {
    return this.userService.findById(id);
  }

  @UseInterceptors(FilesInterceptor('images'))
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post('/update')
  update(
    @Request() req: RequestJwtPayloadType,
    @UploadedFiles() images: Express.Multer.File[] = [],
    @Body() options: UserUpdateDTO,
  ) {
    return this.userService.update(req.user, options, images);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Delete('/image')
  deleteImage(
    @Request() req: RequestJwtPayloadType,
    @Body() options: DeletePhotoRequestDTO,
  ) {
    return this.userService.deleteImage(req.user, options);
  }
}
