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
  FRIEND_REPOSITORY,
  REQUEST_REPOSITORY,
  USER_BANNED,
} from 'src/core/providers-names';
import { locale } from 'src/locale';
import { UserBanned } from 'src/user/entity/user-banned.entity';
import { User } from 'src/user/entity/User.entity';
import { UserImage } from 'src/user/entity/UserImage.entity';
import { UserMainImage } from 'src/user/entity/UserMainImage';
import { FriendManagerDTO } from './dto/friend-manager.dto';
import { FriendDTO, FriendManagerItemDTO } from './dto/friend.dto';
import { GetAllFriendDTO } from './dto/get-all-friend.dto';
import { GetAllRequestsDTO } from './dto/get-all-requests.dto';
import { Friend } from './entity/friend.entity';
import { RequstFriend } from './entity/request.entity';

const friendLocale = locale.friends;

@Injectable()
export class FriendService {
  constructor(
    @Inject(FRIEND_REPOSITORY) private readonly friendRepository: typeof Friend,
    @Inject(USER_BANNED)
    private readonly userBannedRepository: typeof UserBanned,

    @Inject(REQUEST_REPOSITORY)
    private readonly requestRepository: typeof RequstFriend,
  ) {}

  async getAllFriends(userId: number): Promise<GetAllFriendDTO> {
    const friends = await this.friendRepository.findAll({
      where: {
        [Op.or]: [{ userId: userId }, { friendId: userId }],
      },
      include: [
        {
          model: User,
          as: 'user',
          required: false,
          include: [
            {
              model: UserMainImage,
              include: [UserImage],
            },
          ],
          where: {
            [Op.not]: {
              id: userId,
            },
          },
        },
        {
          model: User,
          as: 'friend',
          required: false,
          include: [
            {
              model: UserMainImage,
              include: [UserImage],
            },
          ],
          where: {
            [Op.not]: {
              id: userId,
            },
          },
        },
      ],
    });

    const currentFriends = friends.map((friendObj) => {
      const friend = friendObj.user ?? friendObj.friend;

      return new FriendDTO({
        ...friendObj.get(),
        friend: friend,
      });
    });

    return new GetAllFriendDTO({
      message: friendLocale.allFriends,
      friends: currentFriends,
    });
  }

  async getAllRequests(userId: number) {
    const requests = await this.requestRepository.findAll({
      where: {
        friendId: userId,
      },
      include: [
        {
          model: User,
          as: 'user',
          required: false,
          include: [
            {
              model: UserMainImage,
              include: [UserImage],
            },
          ],
          where: {
            [Op.not]: {
              id: userId,
            },
          },
        },
        {
          model: User,
          as: 'friend',
          required: false,
          include: [
            {
              model: UserMainImage,
              include: [UserImage],
            },
          ],
          where: {
            [Op.not]: {
              id: userId,
            },
          },
        },
      ],
    });

    const currentRequests = requests.map((friendObj) => {
      const friend = friendObj.user ?? friendObj.friend;

      return new FriendDTO({
        ...friendObj.get(),
        friend: friend,
      });
    });

    return new GetAllRequestsDTO({
      message: friendLocale.allRequests,
      requests: currentRequests,
    });
  }

  async sendRequest(token: JwtPayloadType, friendId: number) {
    if (token.userId == friendId) {
      throw new ForbiddenException();
    }

    const [request] = await this.requestRepository.findOrCreate({
      where: {
        [Op.or]: [
          { friendId: friendId, userId: token.userId },
          { friendId: token.userId, userId: friendId },
        ],
      },
      defaults: {
        friendId: friendId,
        userId: token.userId,
      },
    });

    return new FriendManagerDTO({
      message: friendLocale.send,
      data: new FriendManagerItemDTO(request.get()),
    });
  }

  async acceptRequest(token: JwtPayloadType, requestId: number) {
    const request = await this.requestRepository.findByPk(requestId);
    if (!request) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    if (token.userId == request.userId) {
      throw new ForbiddenException();
    }
    await request.destroy();

    const friend = await this.friendRepository.create({
      userId: token.userId,
      friendId:
        request.friendId === token.userId ? request.userId : request.friendId,
    });

    return new FriendManagerDTO({
      message: friendLocale.accept,
      data: new FriendManagerItemDTO(friend.get()),
    });
  }

  async rejectRequest(token: JwtPayloadType, requestId: number) {
    const request = await this.requestRepository.findByPk(requestId);
    if (!request) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    if (token.userId !== request.friendId && token.userId !== request.userId) {
      throw new ForbiddenException();
    }
    await request.destroy();

    return new FriendManagerDTO({
      message: friendLocale.reject,
      data: new FriendManagerItemDTO(request.get()),
    });
  }

  async deleteFriend(token: JwtPayloadType, friendId: number) {
    const request = await this.friendRepository.findByPk(friendId);
    if (!request) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    if (request.userId !== token.userId && request.friendId !== token.userId) {
      throw new ForbiddenException();
    }
    await request.destroy();

    return new FriendManagerDTO({
      message: friendLocale.delete,
      data: new FriendManagerItemDTO(request.get()),
    });
  }

  async findFriendByIdIfNotExist(userOneId: number, userTwoId: number) {
    return this.friendRepository.findOne({
      where: {
        [Op.or]: [
          { friendId: userOneId, userId: userTwoId },
          { friendId: userTwoId, userId: userOneId },
        ],
      },
    });
  }
}
