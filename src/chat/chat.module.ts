import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { postProviders } from './chat.providers';
import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './chat.gateway';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [UserModule, FileModule],
  providers: [ChatService, ...postProviders, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
