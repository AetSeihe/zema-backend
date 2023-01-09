import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { FriendController } from './friend.controller';
import { friendProviders } from './friend.providers';
import { FriendService } from './friend.service';

@Module({
  imports: [UserModule],
  controllers: [FriendController],
  providers: [FriendService, ...friendProviders],
})
export class FriendModule {}
