import { UserDTO } from 'src/user/dto/user.dto';

export class CommentDto {
  constructor(partial: Partial<any>) {
    Object.assign(this, partial);
    this.user = new UserDTO(partial.user.get());
  }
  id: number;
  userId: number;
  user: UserDTO;
  postId: number;
  text: string;
  updatedAt: Date;
  createdAt: Date;
}
