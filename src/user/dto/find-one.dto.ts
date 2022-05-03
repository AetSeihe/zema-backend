import { User } from '../entity/User.entity';
import { UserDTO } from './user.dto';

export class FindOneDTO {
  constructor(message: string, user: User) {
    this.message = message;
    this.user = new UserDTO(user);
  }

  message: string;
  user: UserDTO;
}
