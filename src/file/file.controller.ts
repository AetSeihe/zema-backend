import { Controller, Get, Param, Response } from '@nestjs/common';
import { FileService } from './file.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('File')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('/:filename')
  getFile(@Response() res, @Param('filename') filename: string) {
    res.sendFile(this.fileService.get(filename));
  }
}
