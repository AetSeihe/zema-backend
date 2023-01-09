import { Sequelize } from 'sequelize-typescript';
import { City } from 'src/city/entity/City.entity';
import { DB_REPOSITORY } from 'src/core/providers-names';
import { Friend } from 'src/friend/entity/friend.entity';
import { RequstFriend } from 'src/friend/entity/request.entity';
import { Comment } from 'src/post/enity/Comment.entity';
import { Like } from 'src/post/enity/Like.entity';
import { Post } from 'src/post/enity/Post.enity';
import { PostFiles } from 'src/post/enity/PostFiles.entity';
import { Resume } from 'src/resume/entity/resume.enity';
import { Message } from '../chat/entity/Message.entity';
import { User } from 'src/user/entity/User.entity';
import { UserImage } from 'src/user/entity/UserImage.entity';
import { UserMainImage } from 'src/user/entity/UserMainImage';
import { Vacancy } from 'src/vacancy/entity/vacancy.enity';
import { Chat } from 'src/chat/entity/Chat.entity';
import { ReplyMessage } from 'src/chat/entity/ReplyMessage';
import { MessageFile } from 'src/chat/entity/MessageFile.entity';
import { UserBanned } from 'src/user/entity/user-banned.entity';
import { Skills } from 'src/vacancy/entity/skills';
import { ResumeSkills } from 'src/resume/entity/resume-skills';

export const databaseProviders = [
  {
    provide: DB_REPOSITORY,
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        models: [
          User,
          City,
          UserImage,
          Post,
          Like,
          PostFiles,
          Comment,
          Friend,
          RequstFriend,
          UserMainImage,
          Vacancy,
          Resume,
          Message,
          Chat,
          ReplyMessage,
          MessageFile,
          UserBanned,
          Skills,
          ResumeSkills,
        ],
      });
      await sequelize.sync({ alter: true });

      return sequelize;
    },
  },
];
