import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { locale } from 'src/locale';
import { UserSignUp } from 'src/user/dto/user-signup.dto';
import { UserDTO } from 'src/user/dto/user.dto';
import { User } from 'src/user/entity/User.entity';
import { UserService } from 'src/user/user.service';
import { JwtPayloadType } from './types/JwtPayload.type';
import { UserSignUpRequest } from './types/UserSignUpRequest.dto';

const localeService = locale.auth.service;

@Injectable()
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<User> {
    const user = await this.usersService.findOneByLogin(username);
    if (user && user.password === pass) {
      return user;
    }
    return null;
  }

  async login(user: JwtPayloadType) {
    const payload: JwtPayloadType = {
      username: user.username,
      userId: user.userId,
    };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
    });
    return {
      access_token: token,
    };
  }

  async signUp(options: UserSignUp) {
    const user = await this.usersService.create(options);
    const payload: JwtPayloadType = {
      userId: user.id,
      username: user.name,
    };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
    });
    return new UserSignUpRequest({
      message: localeService.signUp,
      token: token,
      user: new UserDTO(user),
    });
  }
}
