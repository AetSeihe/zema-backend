import { Sequelize } from 'sequelize-typescript';
import { City } from 'src/city/entity/City.entity';
import { User } from 'src/user/entity/User.entity';
import { UserImage } from 'src/user/entity/UserImage.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        models: [User, City, UserImage],
      });
      await sequelize.sync({ alter: true });

      return sequelize;
    },
  },
];
