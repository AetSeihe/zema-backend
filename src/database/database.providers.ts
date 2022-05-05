import { Sequelize } from 'sequelize-typescript';
import { City } from 'src/city/entity/City.entity';
import { DB_REPOSITORY } from 'src/core/providers-names';
import { Comment } from 'src/post/enity/Comment.entity';
import { Like } from 'src/post/enity/Like.entity';
import { Post } from 'src/post/enity/Post.enity';
import { PostFiles } from 'src/post/enity/PostFiles.entity';

import { User } from 'src/user/entity/User.entity';
import { UserImage } from 'src/user/entity/UserImage.entity';

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
        models: [User, City, UserImage, Post, Like, PostFiles, Comment],
      });
      await sequelize.sync({ alter: true });

      return sequelize;
    },
  },
];
