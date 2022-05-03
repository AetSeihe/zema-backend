import { UserImageDTO } from './user-Image.dto';

type DeletePhotoDTOType = {
  message: string;
  image: UserImageDTO;
};

export class DeletePhotoDTO {
  constructor({ message, image }: DeletePhotoDTOType) {
    this.message = message;
    this.image = image;
  }

  message: string;
  image: UserImageDTO;
}
