import { UserDTO } from './user.dto';

export class GetAll {
  constructor(message: string, users: UserDTO[]) {
    this.message = message;
    this.users = users;
  }

  message: string;
  users: UserDTO[];
}
