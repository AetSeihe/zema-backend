import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { userProviders } from './user.providers';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [FileModule],
  providers: [UserService, ...userProviders],
  controllers: [UserController],
  exports: [UserService, ...userProviders],
})
export class UserModule {}
