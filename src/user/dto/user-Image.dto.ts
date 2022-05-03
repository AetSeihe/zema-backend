import { Exclude } from 'class-transformer';

export class UserImageDTO {
  constructor(partial: Partial<any>) {
    Object.assign(this, partial);
  }

  id: number;
  fileName: number;

  @Exclude()
  createdAt: string;

  @Exclude()
  updatedAt: string;

  @Exclude()
  userId: string;
}
