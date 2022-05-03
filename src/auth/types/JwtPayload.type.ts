import { User } from 'src/user/entity/User.entity';

export type JwtPayloadType = {
  username: string;
  userId: number;
  dataValues?: User;
};

export type RequestJwtPayloadType = {
  user: JwtPayloadType;
};
