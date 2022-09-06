import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { locale } from 'src/locale';
import { UserSignUp } from 'src/user/dto/user-signup.dto';
import { UserDTO } from 'src/user/dto/user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { ApiTags, ApiHeader, ApiBody, ApiResponse } from '@nestjs/swagger';
import { SignInDTO } from './dto/sign-in.dto';
import { AuthResponseDTO } from './dto/auth-response.dto';

const localeService = locale.auth.service;

@ApiTags('Auth')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer [token]',
})
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({
    type: SignInDTO,
  })
  @ApiResponse({
    type: AuthResponseDTO,
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<AuthResponseDTO> {
    const token = await this.authService.login(req.user);
    return new AuthResponseDTO({
      message: localeService.signin,
      token: token.access_token,
      user: new UserDTO(req.user.dataValues),
    });
  }

  @ApiBody({
    type: UserSignUp,
  })
  @ApiResponse({
    type: AuthResponseDTO,
  })
  @Post('/signup')
  async signUp(@Body() data: UserSignUp): Promise<AuthResponseDTO> {
    return this.authService.signUp(data);
  }
}
