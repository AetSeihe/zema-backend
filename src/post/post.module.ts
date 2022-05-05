import { Module } from '@nestjs/common';
import { FileModule } from 'src/file/file.module';
import { PostController } from './post.controller';
import { postProviders } from './post.providers';
import { PostService } from './post.service';

@Module({
  imports: [FileModule],
  controllers: [PostController],
  providers: [PostService, ...postProviders],
})
export class PostModule {}
