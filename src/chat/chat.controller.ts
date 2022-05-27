import {
  Body,
  Controller,
  Get,
  Post,
  Query,
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
import {
  GetAllChatDataDTO,
  GetAllChatOptionsDTO,
  GetChatsDTO,
} from './dto/get-chats.dto';
import { GetMessagesDTO } from './dto/get-messages.dto';
import { SendMessageDTO } from './dto/send-message.dto';
import {
  ApiTags,
  ApiHeader,
  ApiBody,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';

@ApiTags('Chat')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer [token]',
})
@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatGateway: ChatGateway,
  ) {}
  @Post('/all')
  @UseGuards(JwtAuthGuard)
  getAll(
    @Request() req: RequestJwtPayloadType,
    @Body('data') data: GetAllChatDataDTO,
    @Body('options') options: GetAllChatOptionsDTO,
  ) {
    return this.chatService.getAllChats(req.user, data, options);
  }

  @Get('/messages')
  @UseGuards(JwtAuthGuard)
  getMessages(
    @Request() req: RequestJwtPayloadType,
    @Query() options: GetMessagesDTO,
  ) {
    return this.chatService.getMessages(req.user, options);
  }

  @Post('/send')
  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(JwtAuthGuard)
  async sendMessage(
    @Request() req: RequestJwtPayloadType,
    @UploadedFiles() files: Express.Multer.File[] = [],
    @Body() msg: SendMessageDTO,
  ) {
    const message = await this.chatService.sendMessage(req.user, msg, files);
    this.chatGateway.server.emit(`msgToClient ${msg.userTo}`, message);
    this.chatGateway.server.emit(`msgToClient ${req.user.userId}`, message);

    return message;
  }
}
