import { IsString } from 'class-validator';

export class DeletePhotoRequestDTO {
  @IsString()
  photo_name: string;
}
