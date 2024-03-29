import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { CityModule } from './city/city.module';
import { FileModule } from './file/file.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { FriendModule } from './friend/friend.module';
import { VacancyModule } from './vacancy/vacancy.module';
import { ResumeModule } from './resume/resume.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    UserModule,
    DatabaseModule,
    CityModule,
    FileModule,
    AuthModule,
    PostModule,
    FriendModule,
    VacancyModule,
    ResumeModule,
    ChatModule,
  ],
  controllers: [],
})
export class AppModule {}
