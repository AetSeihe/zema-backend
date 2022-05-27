export class FileDTO {
  constructor(partial: Partial<any>) {
    Object.assign(this, partial);
  }

  id: number;
  fileName: string;
  messageId: number;
  createdAt: number;
  updatedAt: number;
}
