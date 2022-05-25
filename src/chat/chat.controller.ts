import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequestJwtPayloadType } from 'src/auth/types/JwtPayload.type';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { GetChatOptions } from './dto/get-chats-options.dto';
import { SendMessageDTO } from './dto/send-message.dto';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  getAllChats(
    @Request() req: RequestJwtPayloadType,
    @Body() options: GetChatOptions,
  ) {
    return this.chatService.getChats(req.user, options);
  }

  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(JwtAuthGuard)
  @Post('/send')
  async sendMessage(
    @UploadedFiles() files: Express.Multer.File[] = [],
    @Request() req: RequestJwtPayloadType,
    @Body() options: SendMessageDTO,
  ) {
    const [message, companionId] = await this.chatService.sendMessage(
      req.user,
      options,
      files,
    );
    this.chatGateway.server.emit(`msgToClient ${companionId}`, message);

    return message;
  }
}
