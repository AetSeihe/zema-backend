import { UserImageDTO } from './user-Image.dto';
import { ApiProperty } from '@nestjs/swagger';

type DeletePhotoDTOType = {
  message: string;
  image: UserImageDTO;
};

export class DeletePhotoDTO {
  constructor({ message, image }: DeletePhotoDTOType) {
    this.message = message;
    this.image = image;
  }

  @ApiProperty()
  message: string;

  @ApiProperty()
  image: UserImageDTO;
}
