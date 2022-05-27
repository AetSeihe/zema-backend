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
import { ApiTags, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { GetAllFriendDTO } from './dto/get-all-friend.dto';
import { FriendManagerDTO } from './dto/friend-manager.dto';

@ApiTags('Friends')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer [token]',
})
@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @ApiResponse({
    type: GetAllFriendDTO,
  })
  @UseGuards(JwtAuthGuard)
  @Get('friends/:id')
  getAllFriends(@Param('id') id: number): Promise<GetAllFriendDTO> {
    return this.friendService.getAllFriends(id);
  }

  @ApiResponse({
    type: GetAllFriendDTO,
  })
  @UseGuards(JwtAuthGuard)
  @Get('request/:id')
  getAllRequests(@Param('id') id: number): Promise<GetAllFriendDTO> {
    return this.friendService.getAllRequests(id);
  }

  @ApiResponse({
    type: FriendManagerDTO,
  })
  @UseGuards(JwtAuthGuard)
  @Post('send/:id')
  sendRequest(
    @Request() req: RequestJwtPayloadType,
    @Param('id') id: number,
  ): Promise<FriendManagerDTO> {
    return this.friendService.sendRequest(req.user, +id);
  }

  @ApiResponse({ type: FriendManagerDTO })
  @UseGuards(JwtAuthGuard)
  @Post('accept/:id')
  acceptRequest(
    @Request() req: RequestJwtPayloadType,
    @Param('id') id: number,
  ): Promise<FriendManagerDTO> {
    return this.friendService.acceptRequest(req.user, +id);
  }

  @ApiResponse({ type: FriendManagerDTO })
  @UseGuards(JwtAuthGuard)
  @Post('reject/:id')
  rejectRequest(
    @Request() req: RequestJwtPayloadType,
    @Param('id') id: number,
  ): Promise<FriendManagerDTO> {
    return this.friendService.rejectRequest(req.user, +id);
  }

  @ApiResponse({ type: FriendManagerDTO })
  @UseGuards(JwtAuthGuard)
  @Delete('delete-friend/:id')
  deleteFreind(
    @Request() req: RequestJwtPayloadType,
    @Param('id') id: number,
  ): Promise<FriendManagerDTO> {
    return this.friendService.deleteFriend(req.user, +id);
  }
}
