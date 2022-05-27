import { Sequelize } from 'sequelize-typescript';
import { Chat } from 'src/chat/entity/Chat.entity';
import { Message } from 'src/chat/entity/Message.entity';
import { MessageAndPintedMessage } from 'src/chat/entity/MessageAndPintedMessage';
import { MessageFiles } from 'src/chat/entity/MessageFiles.entity';
import { PinnedMessages } from 'src/chat/entity/PinnedMessages.entity';
import { City } from 'src/city/entity/City.entity';
import { DB_REPOSITORY } from 'src/core/providers-names';
import { Friend } from 'src/friend/entity/friend.entity';
import { RequstFriend } from 'src/friend/entity/request.entity';
import { Comment } from 'src/post/enity/Comment.entity';
import { Like } from 'src/post/enity/Like.entity';
import { Post } from 'src/post/enity/Post.enity';
import { PostFiles } from 'src/post/enity/PostFiles.entity';

import { User } from 'src/user/entity/User.entity';
import { UserImage } from 'src/user/entity/UserImage.entity';
import { UserMainImage } from 'src/user/entity/UserMainImage';
import { Vacancy } from 'src/vacancy/entity/vacancy.enity';

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
          Vacancy,
          Chat,
          Message,
          MessageFiles,
          PinnedMessages,
          MessageAndPintedMessage,
          UserMainImage,
        ],
      });
      await sequelize.sync({ alter: true });

      return sequelize;
    },
  },
];
