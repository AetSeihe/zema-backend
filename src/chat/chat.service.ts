import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Op } from 'sequelize';
import { JwtPayloadType } from 'src/auth/types/JwtPayload.type';
import {
  CHAT_REPOSITORY,
  MESSAGE_FILE,
  MESSAGE_REPOSITORY,
  REPLY_MESSAGE,
  USER_BANNED,
} from 'src/core/providers-names';
import { FileService } from 'src/file/file.service';
import { UserBanned } from 'src/user/entity/user-banned.entity';
import { User } from 'src/user/entity/User.entity';
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
import { MessageDTO } from './dto/out/message.dto';
import { Chat } from './entity/Chat.entity';
import { Message } from './entity/Message.entity';
import { MessageFile } from './entity/MessageFile.entity';
import { ReplyMessage } from './entity/ReplyMessage';

@Injectable()
export class ChatService {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: typeof Message,
    @Inject(CHAT_REPOSITORY)
    private readonly chatRepository: typeof Chat,
    @Inject(MESSAGE_FILE)
    private readonly filesRepository: typeof MessageFile,
    @Inject(REPLY_MESSAGE)
    private readonly replyMessageRepository: typeof ReplyMessage,
    private readonly fileService: FileService,
    @Inject(USER_BANNED)
    private readonly userBannedRepository: typeof UserBanned,
  ) {}

  async getChatsByMessageText(
    token: JwtPayloadType,
    data: GetChatsByMessageDTO,
  ) {
    const chats = await this.chatRepository.findAll({
      order: [['updatedAt', 'DESC']],
      limit: 10,
      where: {
        [Op.or]: [
          {
            userOneId: token.userId,
          },
          {
            userTwoId: token.userId,
          },
        ],
      },
      include: [
        {
          where: {
            message: {
              [Op.substring]: data.text,
            },
          },
          required: true,
          order: [['createdAt', 'DESC']],
          model: Message,
          as: 'messages',
          limit: 1,
        },
        {
          model: User,
          as: 'userOne',
          required: false,
          where: {
            [Op.not]: {
              id: token.userId,
            },
          },
        },
        {
          model: User,
          as: 'userTwo',
          required: false,
          where: {
            [Op.not]: {
              id: token.userId,
            },
          },
        },
      ],
    });

    const currentChat = chats.filter((chat) => chat.messages.length > 0);

    return new AllChatsDTO({
      chats: currentChat.map((chat) => new ChatDTO(chat.get())),
    });
  }

  async getUsersInChats(token: JwtPayloadType, data: GetUsersInChats) {
    const variantsNick = data.name.split(' ');
    const chats = await this.chatRepository.findAll({
      order: [['updatedAt', 'DESC']],
      limit: 10,
      where: {
        [Op.or]: [
          {
            userOneId: token.userId,
          },
          {
            userTwoId: token.userId,
          },
        ],
      },
      include: [
        {
          model: User,
          as: 'userOne',
          required: false,
          where: {
            [Op.not]: {
              id: token.userId,
            },
            [Op.or]: [
              { name: variantsNick },
              { surname: variantsNick },
              { patronomic: variantsNick },
            ],
          },
        },
        {
          model: User,
          as: 'userTwo',
          required: false,
          where: {
            [Op.not]: {
              id: token.userId,
            },
            [Op.or]: [
              { name: variantsNick },
              { surname: variantsNick },
              { patronomic: variantsNick },
            ],
          },
        },
      ],
    });

    const currentChats = chats.filter((chat) => chat.userOne || chat.userTwo);

    return new AllChatsDTO({
      chats: currentChats.map((chat) => new ChatDTO(chat.get())),
    });
  }

  async getAllChats(
    token: JwtPayloadType,
    options: GetAllChatsDTO,
  ): Promise<AllChatsDTO> {
    const chats = await this.chatRepository.findAll({
      group: 'id',
      order: [['updatedAt', 'DESC']],
      limit: +options.limit,
      offset: +options.offset,
      where: {
        [Op.or]: [
          {
            userOneId: token.userId,
          },
          {
            userTwoId: token.userId,
          },
        ],
      },
      include: [
        {
          order: [['createdAt', 'DESC']],
          model: Message,
          as: 'messages',
          limit: 1,
        },
        {
          model: User,
          as: 'userOne',
          required: false,
          where: {
            [Op.not]: {
              id: token.userId,
            },
          },
        },
        {
          model: User,
          as: 'userTwo',
          required: false,
          where: {
            [Op.not]: {
              id: token.userId,
            },
          },
        },
      ],
    });

    const currentChats = chats.filter((chat) => chat.messages.length !== 0);

    return new AllChatsDTO({
      chats: currentChats.map((chat) => new ChatDTO(chat.get())),
      unreadedMessagesCount: 1,
    });
  }

  async sendMessage(
    token: JwtPayloadType,
    data: SendMessageDTO,
    files: Express.Multer.File[],
  ): Promise<[string, MessageDTO, Chat]> {
    const userOneId = token.userId.toString();
    const userTwoId = data.userTo;
    const candidate = await this.userBannedRepository.findOne({
      where: {
        [Op.or]: [
          {
            userId: token.userId,
            bannedUserId: userTwoId,
          },
          {
            userId: userTwoId,
            bannedUserId: token.userId,
          },
        ],
      },
    });

    if (candidate) {
      throw new ForbiddenException();
    }

    const [chat] = await this.chatRepository.findOrCreate({
      where: {
        [Op.or]: [
          {
            userOneId: +userOneId,
            userTwoId: +userTwoId,
          },
          {
            userOneId: +userTwoId,
            userTwoId: +userOneId,
          },
        ],
      },
      defaults: {
        userOneId: +userOneId,
        userTwoId: +userTwoId,
      },
    });

    const message = await this.messageRepository.create({
      chatId: chat.id,
      message: data.message,
      userId: token.userId,
    });

    if (data.replyMessageId) {
      this.replyMessageRepository.create({
        messageId: message.id,
        replyMessageId: +data.replyMessageId,
      });
    }

    if (files && files.length > 0) {
      const filesName = await this.fileService.createFiles(files);
      await Promise.all(
        filesName.map((fileName, i) => {
          return this.filesRepository.create({
            fileName: fileName,
            fileType: files[i].mimetype || 'none',
            chatId: chat.id,
            messageId: message.id,
          });
        }),
      );
    }
    chat.changed('updatedAt', true);
    chat.updatedAt = new Date();
    await chat.save();

    const currentChat = await this.chatRepository.findByPk(chat.id, {
      include: [
        {
          model: Message,
          limit: 1,
          order: [['createdAt', 'DESC']],
        },
        {
          model: User,
          as: 'userOne',
          required: false,
          where: {
            id: token.userId,
          },
        },
        {
          model: User,
          as: 'userTwo',
          required: false,
          where: {
            id: token.userId,
          },
        },
      ],
    });
    const currentMessage = await this.messageRepository.findByPk(message.id, {
      include: [
        {
          model: ReplyMessage,
          include: [
            {
              model: Message,
              as: 'reply',
            },
          ],
        },
        {
          model: MessageFile,
        },
      ],
    });

    return [data.userTo, new MessageDTO(currentMessage.get()), currentChat];
  }

  async readMessage(
    token: JwtPayloadType,
    data: ReadMessageDTO,
  ): Promise<[MessageDTO[], ChatDTO]> {
    const messageId = data.messagesId[0];

    if (!messageId) {
      throw new HttpException('Чат не найден', HttpStatus.NOT_FOUND);
    }

    const currentChat = await this.chatRepository.findOne({
      include: [
        {
          model: Message,
          limit: 1,
          order: [['createdAt', 'DESC']],
          where: {
            id: messageId,
          },
        },
        {
          model: User,
          as: 'userOne',
          required: false,
          where: {
            id: token.userId,
          },
        },
        {
          model: User,
          as: 'userTwo',
          required: false,
          where: {
            id: token.userId,
          },
        },
      ],
    });

    if (!currentChat) {
      throw new HttpException('Чат не найден', HttpStatus.NOT_FOUND);
    }
    // const message = await this.messageRepository.findByPk(data.messageId);

    try {
      const messages: Message[] = await Promise.all(
        data.messagesId.map(async (item) => {
          const message = await this.messageRepository.findByPk(item, {});
          message.readed = true;
          message.save();
          return message;
        }),
      );

      return [
        messages.map((message) => new MessageDTO(message.get())),
        new ChatDTO(currentChat.get()),
      ];
    } catch (e) {
      throw new HttpException(
        'Ошибка при продчетнии сообщений',
        HttpStatus.NO_CONTENT,
      );
    }
  }

  async getChatMessages(
    token: JwtPayloadType,
    data: GetChatMessagesDTO,
  ): Promise<AllMessagessDTO> {
    const chat = await this.chatRepository.findByPk(+data.chatId);

    if (!chat) {
      throw new HttpException('Чат не найден', HttpStatus.NOT_FOUND);
    }

    if (chat.userOneId !== token.userId && chat.userTwoId !== token.userId) {
      throw new HttpException('Чат не найден 123', HttpStatus.NOT_FOUND);
    }

    const messages = await this.messageRepository.findAll({
      order: [['createdAt', 'DESC']],
      limit: +data.limit,
      offset: +data.offset,
      include: [
        {
          model: ReplyMessage,
          include: [
            {
              model: Message,
              as: 'reply',
            },
          ],
        },
        {
          model: MessageFile,
        },
      ],
      where: {
        chatId: +data.chatId,
      },
    });

    return new AllMessagessDTO({
      messages: messages.map((message) => new MessageDTO(message.get())),
    });
  }

  async createChatIfNotExist(data: CreateChatDTO) {
    const [chat] = await this.chatRepository.findOrCreate({
      where: {
        [Op.or]: [
          {
            userOneId: +data.userOneId,
            userTwoId: +data.userTwoId,
          },
          {
            userOneId: +data.userTwoId,
            userTwoId: +data.userOneId,
          },
        ],
      },
      defaults: {
        userOneId: +data.userOneId,
        userTwoId: +data.userTwoId,
      },
    });

    return chat;
  }

  async getOrCreateChatIfNotExistWithCompanion(
    token: JwtPayloadType,
    data: CreateChatDTO,
  ) {
    const candidate = await this.userBannedRepository.findOne({
      where: {
        [Op.or]: [
          {
            userId: token.userId,
            bannedUserId: data.userTwoId,
          },
          {
            userId: data.userTwoId,
            bannedUserId: token.userId,
          },
        ],
      },
    });

    if (candidate) {
      throw new ForbiddenException();
    }

    const [chat] = await this.chatRepository.findOrCreate({
      where: {
        [Op.or]: [
          {
            userOneId: +data.userOneId,
            userTwoId: +data.userTwoId,
          },
          {
            userOneId: +data.userTwoId,
            userTwoId: +data.userOneId,
          },
        ],
      },
      defaults: {
        userOneId: +data.userOneId,
        userTwoId: +data.userTwoId,
      },
      include: [
        {
          model: Message,
          limit: 1,
          order: [['createdAt', 'DESC']],
        },
        {
          model: User,
          as: 'userOne',
          required: false,
          where: {
            [Op.not]: {
              id: token.userId,
            },
          },
        },
        {
          model: User,
          as: 'userTwo',
          required: false,
          where: {
            [Op.not]: {
              id: token.userId,
            },
          },
        },
      ],
    });

    return chat;
  }
}
