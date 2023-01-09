import {
  Body,
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
import {
  ApiTags,
  ApiHeader,
  ApiBody,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { GetAll } from './dto/get-all.dto';
import { FindOneDTO } from './dto/find-one.dto';
import { DeletePhotoDTO } from './dto/delete-photo.dto';
import { GetUsersByCordsDTO } from './dto/UsersByCords.dto';
import { UserDTO } from './dto/user.dto';
@ApiTags('User')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer [token]',
})
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBody({
    type: UserGetAllOptionsDTO,
  })
  @ApiResponse({
    type: GetAll,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/all-by-cords')
  getAllByCords(
    @Request() req: RequestJwtPayloadType,
    @Body() data: GetUsersByCordsDTO,
  ): Promise<GetAll> {
    return this.userService.getUsersByCords(req.user, data);
  }

  @ApiBody({
    type: UserGetAllOptionsDTO,
  })
  @ApiResponse({
    type: GetAll,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/all')
  getAll(@Query() options: UserGetAllOptionsDTO): Promise<GetAll> {
    return this.userService.findAll(options);
  }

  @ApiResponse({
    type: FindOneDTO,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/current-user/:id')
  getById(
    @Request() req: RequestJwtPayloadType,
    @Param('id') id: number,
  ): Promise<FindOneDTO> {
    return this.userService.findById(req.user, id);
  }

  @ApiBody({
    type: UserUpdateDTO,
  })
  @ApiResponse({
    type: FindOneDTO,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images'))
  @UseGuards(JwtAuthGuard)
  @Post('/update')
  update(
    @Request() req: RequestJwtPayloadType,
    @UploadedFiles() images: Express.Multer.File[] = [],
    @Body() options: UserUpdateDTO,
  ): Promise<FindOneDTO> {
    return this.userService.update(req.user, options, images);
  }

  @ApiBody({
    type: DeletePhotoRequestDTO,
  })
  @ApiResponse({
    type: DeletePhotoDTO,
  })
  @UseGuards(JwtAuthGuard)
  @Delete('/image')
  deleteImage(
    @Request() req: RequestJwtPayloadType,
    @Body() options: DeletePhotoRequestDTO,
  ): Promise<DeletePhotoDTO> {
    return this.userService.deleteImage(req.user, options);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/all-bans')
  getBanUsers(@Request() req: RequestJwtPayloadType): Promise<UserDTO[]> {
    return this.userService.getAllBannedUser(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/ban/:id')
  banUser(
    @Request() req: RequestJwtPayloadType,
    @Param('id') id: string,
  ): Promise<boolean> {
    return this.userService.banUser(req.user, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/ban/:id')
  unUser(
    @Request() req: RequestJwtPayloadType,
    @Param('id') id: string,
  ): Promise<boolean> {
    return this.userService.unBan(req.user, id);
  }
}
