export class LikeDto {
  constructor(partial: Partial<LikeDto>) {
    Object.assign(this, partial);
  }
  id: number;
  userId: number;
  postId: number;
  updatedAt: Date;
  createdAt: Date;
}
