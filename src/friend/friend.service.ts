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
} from 'src/core/providers-names';
import { User } from 'src/user/entity/User.entity';
import { UserImage } from 'src/user/entity/UserImage.entity';
import { Friend } from './entity/friend.entity';
import { RequstFriend } from './entity/request.entity';

@Injectable()
export class FriendService {
  constructor(
    @Inject(FRIEND_REPOSITORY) private readonly friendRepository: typeof Friend,
    @Inject(REQUEST_REPOSITORY)
    private readonly requestRepository: typeof RequstFriend,
  ) {}

  async getAllFriends(userId: number) {
    const friends = this.friendRepository.findAll({
      where: {
        [Op.or]: {
          userId: userId,
          friendId: userId,
        },
      },
      include: [
        {
          model: User,
          include: [UserImage],
          as: 'user',
        },
        {
          model: User,
          include: [UserImage],
          as: 'friend',
        },
      ],
    });

    return friends;
  }

  async getAllRequests(userId: number) {
    const friends = this.requestRepository.findAll({
      where: {
        friendId: userId,
      },
      include: [
        {
          model: User,
          include: [UserImage],
          as: 'friend',
        },
      ],
    });

    return friends;
  }

  async sendRequest(token: JwtPayloadType, friendId: number) {
    if (token.userId == friendId) {
      throw new ForbiddenException();
    }

    const friend = await this.friendRepository.findOne({
      where: {
        [Op.or]: {
          friendId: friendId,
        },
      },
      include: [
        {
          model: User,
          include: [UserImage],
        },
      ],
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

    return request;
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
      friendId: request.friendId,
    });

    return friend;
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
    return request;
  }

  async deleteFriend(token: JwtPayloadType, friendId: number) {
    const request = await this.friendRepository.findByPk(friendId);
    if (!request) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    await request.destroy();
    return request;
  }
}
