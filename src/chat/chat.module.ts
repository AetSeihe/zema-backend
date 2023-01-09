import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { chatProviders } from './chat.providers';
import { FileModule } from 'src/file/file.module';
import { ChatGateway } from './chat.gateway';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [FileModule, UserModule],
  providers: [ChatService, ...chatProviders, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
