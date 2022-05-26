import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { userProviders } from './chat.providers';
import { UserModule } from 'src/user/user.module';
import { FileModule } from 'src/file/file.module';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [UserModule, FileModule],
  providers: [ChatService, ...userProviders, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
