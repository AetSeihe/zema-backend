import { MIN_PASSWORD_LENGHT } from 'src/core/constants';

export const ru = {
  post: {
    service: {
      findAll: 'Все посты по вашему запросу',
      findById: 'Пост найден!',
    },
  },
  user: {
    service: {
      findAll: 'Список всех пользователей',
      findOne: 'Пользователь найден',
      userDataExistError: 'Данный email или номер телефона уже используется',
      deletePhoto: 'Фото успешно удаленно',
    },
    database: {
      emailError: 'Это поле должно быть почтой',
      passwordError: `Пароль должен быть больше ${MIN_PASSWORD_LENGHT} символов`,
    },
  },
  auth: {
    service: {
      signin: 'Вы успешно вошли',
      signUp: 'Вы успешно зарегистрировались',
    },
  },
};
