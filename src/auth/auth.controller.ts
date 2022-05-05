import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { locale } from 'src/locale';
import { UserSignUp } from 'src/user/dto/user-signup.dto';
import { UserDTO } from 'src/user/dto/user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtPayloadType, RequestJwtPayloadType } from './types/JwtPayload.type';

const localeService = locale.auth.service;

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const token = await this.authService.login(req.user);
    return {
      message: localeService.signin,
      token: token.access_token,
      user: new UserDTO(req.user.dataValues),
    };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/signup')
  async signUp(@Body() data: UserSignUp) {
    return this.authService.signUp(data);
  }
}
