import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { exists, mkdir, writeFile, unlink } from 'async-file';
import { resolve } from 'path';

@Injectable()
export class FileService {
  get(filename: string) {
    const filePath = resolve(__dirname, '..', 'uploads', filename);
    return filePath;
  }

  async create(file: Express.Multer.File) {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = uuid.v4() + '.' + fileExtension;
      const filePath = resolve(__dirname, '..', 'uploads');
      const existFile = await exists(filePath);
      if (!existFile) {
        await mkdir(filePath);
      }
      await writeFile(resolve(filePath, fileName), file.buffer);
      return fileName;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createFiles(files: Express.Multer.File[]): Promise<string[]> {
    return Promise.all(files.map((file) => this.create(file)));
  }

  async deleteFileImage(fileName: string) {
    const filePath = resolve(__dirname, '..', 'uploads', fileName);
    await unlink(filePath);

    return fileName;
  }

  deleteFilesImage(filesNames: string[]) {
    filesNames.map(this.deleteFileImage);
  }
}
