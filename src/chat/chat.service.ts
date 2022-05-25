import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { JwtPayloadType } from 'src/auth/types/JwtPayload.type';
import {
  CHAT_REPOSITORY,
  CHAT_USER_REPOSITORY,
  MESSAGE_FILE_REPOSITORY,
  MESSAGE_PINTED_REPOSITORY,
  MESSAGE_REPOSITORY,
  USER_REPOSITORY,
} from 'src/core/providers-names';
import { FileService } from 'src/file/file.service';
import { User } from 'src/user/entity/User.entity';
import { GetChatOptions } from './dto/get-chats-options.dto';
import { SendMessageDTO } from './dto/send-message.dto';
import { Chat } from './entity/Chat.entity';
import { ChatUser } from './entity/ChatUser.enity';
import { Message } from './entity/Message';
import { MessageFile } from './entity/MessageFile';
import { PinnedMessage } from './entity/PinnedMessage.enity';

@Injectable()
export class ChatService {
  constructor(
    private readonly fileService: FileService,

    @Inject(CHAT_REPOSITORY) private readonly chatRepository: typeof Chat,
    @Inject(CHAT_USER_REPOSITORY)
    private readonly chatUserRepository: typeof ChatUser,
    @Inject(MESSAGE_FILE_REPOSITORY)
    private readonly messageFileRepository: typeof MessageFile,
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: typeof Message,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: typeof User,
    @Inject(MESSAGE_PINTED_REPOSITORY)
    private readonly pinnedRepository: typeof PinnedMessage,
  ) {}

  async getChats(token: JwtPayloadType, options: GetChatOptions) {
    console.log('!!!! token', token);
    const user = await this.userRepository.findByPk(token.userId, {
      attributes: [],
      include: [
        {
          attributes: ['chatId'],
          model: ChatUser,
          required: true,
          include: [
            {
              model: Chat,
              include: [
                {
                  attributes: ['userId'],
                  model: ChatUser,
                  include: [User],
                },
                {
                  attributes: ['id', 'message', 'userId'],
                  model: Message,
                  include: [
                    {
                      model: PinnedMessage,
                    },
                  ],
                  limit: 5,
                },
              ],
            },
          ],
        },
      ],
    });

    const chats = user.chats.map((chat) => {
      return {
        ...chat.chat.get(),
        chatUsers: undefined,
        companion: {
          ...chat.chat
            .get()
            .chatUsers.find((user) => {
              console.log(user.get().userId);
              return user.get().id !== token.userId;
            })
            .user.get(),
          userId: undefined,
        },
      };
    });
    return chats;
  }

  async sendMessage(
    token: JwtPayloadType,
    message: SendMessageDTO,
    files: Express.Multer.File[],
  ) {
    let chat = await this.chatRepository.findOne({
      include: {
        model: ChatUser,
        required: true,
        where: {
          userId: message.userTo,
        },
      },
    });

    if (!chat) {
      chat = await this.createChat(token, message.userTo);
    }

    this.uploadFiles(chat.id, files);

    const msg = await this.messageRepository.create({
      chatId: chat.id,
      userId: token.userId,
      message: message.message,
    });

    if (message.pinnedMessage) {
      console.log('!!! message', message);
      const pinned = await this.pinnedRepository.create({
        messageId: msg.id,
        pinnedMessagesId: message.pinnedMessage,
      });
    }

    const currentMessage = await this.messageRepository.findByPk(msg.id, {
      include: [MessageFile, PinnedMessage],
    });

    return [currentMessage, message.userTo];
  }

  private async createChat(token: JwtPayloadType, userTo: number) {
    const chat = await this.chatRepository.create();
    console.log('!!!! register users', token, userTo);
    this.chatUserRepository.create({
      chatId: chat.id,
      userId: token.userId,
    });

    this.chatUserRepository.create({
      chatId: chat.id,
      userId: userTo,
    });

    return chat;
  }

  private async uploadFiles(messageId: number, files: Express.Multer.File[]) {
    const imagesUrls = await this.fileService.createFiles(files);

    await Promise.all(
      imagesUrls.map((path) => {
        return this.messageFileRepository.create({
          fileUrl: path,
          messageId: messageId,
        });
      }),
    );
  }
}
