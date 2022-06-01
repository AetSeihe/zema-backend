import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayloadType } from './types/JwtPayload.type';
import { USER_REPOSITORY } from 'src/core/providers-names';
import { User } from 'src/user/entity/User.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayloadType): Promise<JwtPayloadType> {
    const user = await this.userRepository.findByPk(payload.userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { userId: payload.userId, username: payload.username };
  }
}
