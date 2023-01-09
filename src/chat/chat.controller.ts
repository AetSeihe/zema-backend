import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Put,
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
import { CreateChatDTO } from './dto/in/create-chat.dto';
import { GetAllChatsDTO } from './dto/in/get-all-chats.dto';
import { GetChatMessagesDTO } from './dto/in/get-chat-messages.dto';
import { GetChatsByMessageDTO } from './dto/in/get-chats-by-message.dto';
import { GetUsersInChats } from './dto/in/get-users-in-chats.dto';
import { ReadMessageDTO } from './dto/in/read-message';
import { SendMessageDTO } from './dto/in/send-message.dto';
import { AllChatsDTO } from './dto/out/all-chats.dto';
import { AllMessagessDTO } from './dto/out/all-messages.dto';
import { ChatDTO } from './dto/out/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Get('/all')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  getAllChats(
    @Request() req: RequestJwtPayloadType,
    @Query() data: GetAllChatsDTO,
  ): Promise<AllChatsDTO> {
    return this.chatService.getAllChats(req.user, data);
  }

  @Get('/chats-by-msg')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  getChatsByMessageText(
    @Request() req: RequestJwtPayloadType,
    @Query() data: GetChatsByMessageDTO,
  ) {
    return this.chatService.getChatsByMessageText(req.user, data);
  }

  @Get('/users-chats')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  getAllUserChats(
    @Request() req: RequestJwtPayloadType,
    @Query() data: GetUsersInChats,
  ): Promise<AllChatsDTO> {
    return this.chatService.getUsersInChats(req.user, data);
  }

  @Get('/messages')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  getMessages(
    @Request() req: RequestJwtPayloadType,
    @Query() data: GetChatMessagesDTO,
  ): Promise<AllMessagessDTO> {
    return this.chatService.getChatMessages(req.user, data);
  }

  @Post('/send')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(JwtAuthGuard)
  async sendMessage(
    @Request() req: RequestJwtPayloadType,
    @Body() data: SendMessageDTO,
    @UploadedFiles() files: Express.Multer.File[] = [],
  ) {
    const [userTo, message, chat] = await this.chatService.sendMessage(
      req.user,
      data,
      files,
    );

    this.chatGateway.server.emit(`sendMessage ${userTo}`, [
      message,
      new ChatDTO(chat.get()),
    ]);

    return message;
  }

  @Put('/read')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async readMessage(
    @Request() req: RequestJwtPayloadType,
    @Body() data: ReadMessageDTO,
  ) {
    
    const [messages, chat] = await this.chatService.readMessage(req.user, data);
    const userTo = messages[0].chatId;
    if (userTo) {
      this.chatGateway.server.emit(
        `readMessage ${chat.companion.id}`,
        messages,
      );
    }
    return messages;
  }

  @Get('/get-chat')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async createChatIfNotExist(
    @Request() req: RequestJwtPayloadType,
    @Query() data: CreateChatDTO,
  ) {
    const res = await this.chatService.getOrCreateChatIfNotExistWithCompanion(
      req.user,
      data,
    );

    return new ChatDTO(res.get());
  }
}
