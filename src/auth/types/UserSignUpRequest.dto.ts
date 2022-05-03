import { UserDTO } from 'src/user/dto/user.dto';

type Props = {
  message: string;
  token: string;
  user: UserDTO;
};

export class UserSignUpRequest {
  constructor({ message, token, user }: Props) {
    this.message = message;
    this.token = token;
    this.user = user;
  }
  message: string;
  token: string;
  user: UserDTO;
}
