import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequestJwtPayloadType } from 'src/auth/types/JwtPayload.type';
import { FriendService } from './friend.service';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @UseGuards(JwtAuthGuard)
  @Get('friends/:id')
  getAllFriends(@Param('id') id: number) {
    return this.friendService.getAllFriends(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('request/:id')
  getAllRequests(@Param('id') id: number) {
    return this.friendService.getAllRequests(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('send/:id')
  sendRequest(@Request() req: RequestJwtPayloadType, @Param('id') id: number) {
    return this.friendService.sendRequest(req.user, +id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('accept/:id')
  acceptRequest(
    @Request() req: RequestJwtPayloadType,
    @Param('id') id: number,
  ) {
    return this.friendService.acceptRequest(req.user, +id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reject/:id')
  rejectRequest(
    @Request() req: RequestJwtPayloadType,
    @Param('id') id: number,
  ) {
    return this.friendService.rejectRequest(req.user, +id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete-friend/:id')
  deleteFreind(@Request() req: RequestJwtPayloadType, @Param('id') id: number) {
    return this.friendService.deleteFriend(req.user, +id);
  }
}
