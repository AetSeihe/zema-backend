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
  USER_REPOSITORY,
} from 'src/core/providers-names';
import { locale } from 'src/locale';
import { User } from 'src/user/entity/User.entity';
import { UserImage } from 'src/user/entity/UserImage.entity';
import { UserMainImage } from 'src/user/entity/UserMainImage';
import { FriendManagerDTO } from './dto/friend-manager.dto';
import { FriendDTO, FriendManagerItemDTO } from './dto/friend.dto';
import { GetAllFriendDTO } from './dto/get-all-friend.dto';
import { Friend } from './entity/friend.entity';
import { RequstFriend } from './entity/request.entity';

const friendLocale = locale.friends;

@Injectable()
export class FriendService {
  constructor(
    @Inject(FRIEND_REPOSITORY) private readonly friendRepository: typeof Friend,
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,

    @Inject(REQUEST_REPOSITORY)
    private readonly requestRepository: typeof RequstFriend,
  ) {}

  async getAllFriends(userId: number): Promise<GetAllFriendDTO> {
    const friends = await this.friendRepository.findAll({
      where: {
        [Op.or]: {
          userId: userId,
          friendId: userId,
        },
      },
    });

    const currentFriends = await Promise.all(
      friends.map(async (friendObj) => {
        const friendId =
          friendObj.userId == userId ? friendObj.friendId : friendObj.userId;
        const friend = await this.userRepository.findByPk(friendId, {
          include: [
            {
              model: UserMainImage,
              include: [UserImage],
            },
          ],
        });

        return new FriendDTO({
          ...friendObj.get(),
          friend: friend,
        });
      }),
    );

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
          include: [
            {
              model: UserMainImage,
              include: [UserImage],
            },
          ],
          as: 'friend',
        },
      ],
    });

    const currentRequests = requests.map(
      (request) => new FriendDTO(request.get()),
    );

    return new GetAllFriendDTO({
      message: friendLocale.allRequests,
      friends: currentRequests,
    });
  }

  async sendRequest(token: JwtPayloadType, friendId: number) {
    if (token.userId == friendId) {
      throw new ForbiddenException();
    }

    const friend = await this.friendRepository.findOne({
      where: {
        friendId: friendId,
      },
    });
    if (friend) {
      throw new ForbiddenException();
    }

    const [request, created] = await this.requestRepository.findOrCreate({
      where: {
        userId: token.userId,
        friendId: friendId,
      },
    });

    if (!created) {
      throw new ForbiddenException();
    }

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
    if (token.userId !== request.friendId) {
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
    await request.destroy();
    return new FriendManagerDTO({
      message: friendLocale.delete,
      data: new FriendManagerItemDTO(request.get()),
    });
  }
}
