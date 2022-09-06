import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Op } from 'sequelize';
import { JwtPayloadType } from 'src/auth/types/JwtPayload.type';
import {
  CHAT_REPOSITORY,
  MESSAGE_AND_PINED_REPOSITORY,
  MESSAGE_FILES_REPOSITORY,
  MESSAGE_PINED_REPOSITORY,
  MESSAGE_REPOSITORY,
  USER_REPOSITORY,
} from 'src/core/providers-names';
import { FileService } from 'src/file/file.service';
import { locale } from 'src/locale';
import { User } from 'src/user/entity/User.entity';
import { UserImage } from 'src/user/entity/UserImage.entity';
import { UserMainImage } from 'src/user/entity/UserMainImage';
import { ChatDto } from './dto/chat.dto';
import { GetAllChatsDTO } from './dto/get-all-chats.dto';
import { GetAllChatDataDTO, GetAllChatOptionsDTO } from './dto/get-chats.dto';
import { GetMessagesDTO, MessagesResponseDTO } from './dto/get-messages.dto';
import { MessageDTO } from './dto/message.dto';
import { ReadMessageDTO } from './dto/read-message.dto';
import { SendMessageDTO } from './dto/send-message.dto';
import { Chat } from './entity/Chat.entity';
import { Message } from './entity/Message.entity';
import { MessageAndPintedMessage } from './entity/MessageAndPintedMessage';
import { MessageFiles } from './entity/MessageFiles.entity';
import { PinnedMessages } from './entity/PinnedMessages.entity';

const chatLocale = locale.chat;
@Injectable()
export class ChatService {
  constructor(
    private readonly fileService: FileService,
    @Inject(CHAT_REPOSITORY) private readonly chatRepository: typeof Chat,
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
    @Inject(MESSAGE_AND_PINED_REPOSITORY)
    private readonly pinnedMsgRepository: typeof MessageAndPintedMessage,

    @Inject(MESSAGE_PINED_REPOSITORY)
    private readonly pinnedRepository: typeof PinnedMessages,
    @Inject(MESSAGE_FILES_REPOSITORY)
    private readonly filesRepository: typeof User,
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: typeof Message,
  ) {}

  async getAllChats(
    token: JwtPayloadType,
    data: GetAllChatDataDTO,
    options: GetAllChatOptionsDTO,
  ) {
    const chats = await this.chatRepository.findAll({
      order: [
        [Message.associations.chat, 'createdAt', 'DESC'],
        ['updatedAt', 'DESC'],
      ],
      limit: +options.limit || 15,
      offset: +options.offset || 0,
      where: {
        [Op.and]: [
          {
            [Op.or]: [{ userOneId: token.userId }, { userTwoId: token.userId }],
          },
          {
            [Op.or]: {
              '$userOne.name$': {
                [Op.substring]: data.userName || '',
              },
              '$userTwo.name$': {
                [Op.substring]: data.userName || '',
              },
              '$userOne.surname$': {
                [Op.substring]: data.userName || '',
              },
              '$userTwo.surname$': {
                [Op.substring]: data.userName || '',
              },
              '$userOne.patronomic$': {
                [Op.substring]: data.userName || '',
              },
              '$userTwo.patronomic$': {
                [Op.substring]: data.userName || '',
              },
            },
          },
        ],
      },
      include: [
        {
          model: Message,
          order: [['createdAt', 'DESC']],
          as: 'messages',
          limit: 3,
        },
        {
          model: User,
          as: 'userOne',
          include: [
            {
              model: UserMainImage,
              include: [UserImage],
            },
          ],
        },
        {
          model: User,
          as: 'userTwo',
          include: [
            {
              model: UserMainImage,
              include: [UserImage],
            },
          ],
        },
      ],
    });

    const currentChats = chats.map((chat) => {
      const companion =
        chat.userOneId == token.userId ? chat.userTwo : chat.userOne;
      const user = chat.userOneId == token.userId ? chat.userOne : chat.userTwo;
      return new ChatDto({
        ...chat.get(),
        userOne: undefined,
        userTwo: undefined,
        user: user,
        companion: companion,
      });
    });

    return new GetAllChatsDTO({
      message: chatLocale.getAll,
      chats: currentChats,
    });
  }

  async getMessages(token: JwtPayloadType, options: GetMessagesDTO) {
    const { messages, ...chat } = await this.chatRepository.findOne({
      where: {
        id: options.chatId,
        [Op.or]: [{ userOneId: token.userId }, { userTwoId: token.userId }],
      },
      include: [
        {
          model: Message,
          limit: +options.limit || 30,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore: Unreachable code error
          offset: +options.offset || 0,
          order: [['createdAt', 'DESC']],
          include: [
            MessageFiles,
            {
              model: MessageAndPintedMessage,
              include: [
                {
                  model: PinnedMessages,
                  include: [
                    {
                      model: Message,
                      include: [
                        {
                          model: User,
                          include: [
                            {
                              model: UserMainImage,
                              include: [UserImage],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!chat) {
      throw new NotFoundException(HttpStatus.NOT_FOUND);
    }
    const currentMessages = messages.map((msg) => new MessageDTO(msg.get()));
    return new MessagesResponseDTO({
      message: chatLocale.messages,
      messages: currentMessages,
    });
  }

  async sendMessage(
    token: JwtPayloadType,
    msg: SendMessageDTO,
    files: Express.Multer.File[],
  ) {
    const companion = await this.userRepository.findByPk(msg.userTo, {
      include: [
        {
          model: UserMainImage,
          include: [UserImage],
        },
      ],
    });

    if (!companion || msg.userTo == token.userId) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const chat = await this.findOrCreateChat(token.userId, msg.userTo);

    chat.changed('updatedAt', true);

    await chat.save();
    const message = await this.messageRepository.create({
      userId: token.userId,
      chatId: chat.id,
      message: msg.message,
    });

    await this.uploadFiles(message.id, files);

    if (msg.pinnedMessage) {
      const p = await this.pinnedMsgRepository.create({
        rootMessageId: message.id,
      });
      await this.pinnedRepository.create({
        messageId: msg.pinnedMessage,
        messageAndPintedMessageId: p.id,
      });
    }

    const currentMessage = await this.messageRepository.findByPk(message.id, {
      include: [
        MessageFiles,
        Chat,
        User,
        {
          model: MessageAndPintedMessage,
          include: [
            {
              model: PinnedMessages,
              include: [Message],
            },
          ],
        },
      ],
    });

    return new MessageDTO({
      ...currentMessage.get(),
      companion,
    });
  }

  async readMessages(token: JwtPayloadType, msg: ReadMessageDTO) {
    try {
      Promise.all(
        msg.messagesId.map(async (msgId) => {
          const message = await this.messageRepository.findByPk(msgId, {
            include: [Chat],
          });
          if (
            message.chat.userOneId === token.userId ||
            message.chat.userTwoId === token.userId
          ) {
            message.update({
              readed: true,
            });
          }
        }),
      );
      return true;
    } catch (e) {
      return false;
    }
  }
  private async uploadFiles(messageId: number, files: Express.Multer.File[]) {
    const imagesUrls = await this.fileService.createFiles(files);
    await Promise.all(
      imagesUrls.map((path) => {
        return this.filesRepository.create({
          fileName: path,
          messageId: messageId,
        });
      }),
    );
  }

  private async findOrCreateChat(userOneId: number, userTwoId: number) {
    const [chat] = await this.chatRepository.findOrCreate({
      where: {
        [Op.or]: [
          {
            userOneId: userOneId,
            userTwoId: userTwoId,
          },
          {
            userOneId: userTwoId,
            userTwoId: userOneId,
          },
        ],
      },
      defaults: {
        userOneId: userOneId,
        userTwoId: userTwoId,
      },
    });
    return chat;
  }
}
