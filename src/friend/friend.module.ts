import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { friendProviders } from './friend.providaters';
import { FriendService } from './friend.service';

@Module({
  controllers: [FriendController],
  providers: [FriendService, ...friendProviders],
})
export class FriendModule {}
