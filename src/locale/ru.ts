import { MIN_PASSWORD_LENGHT } from 'src/core/constants';

export const ru = {
  post: {
    service: {
      findAll: 'Все посты по вашему запросу',
      findById: 'Пост найден!',
      create: 'Пост успешно создан',
      like: 'Вы поставили лайк',
      unlike: 'Вы убрали лайк',
      comment: 'Коммент успешно добавлен',
      delete_comment: 'Коммент успешно удален',
    },
  },
  user: {
    service: {
      findAll: 'Список всех пользователей',
      findOne: 'Пользователь найден',
      userDataExistError: 'Данный email или номер телефона уже используется',
      deletePhoto: 'Фото успешно удаленно',
      update: 'Пользователь успешно обновлен!',
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
  friends: {
    allFriends: 'Список ваших друзей',
    allRequests: 'Список запросов в друзья',
    accept: 'Запрос в друзья принят',
    reject: 'В запросе в друзья отказанно',
    delete: 'Друг успешно удален',
    send: 'Запрос в друзья отправлен',
  },

  vacancy: {
    findAll: 'Все вакансии по вашему запросу',
    create: 'Вакансия успешно созда!на',
    byId: 'Полное описание вакансии',
    delete: 'Вакансия успешно удаленна',
  },

  chat: {
    getAll: 'Все чаты по вашему запросу',
    send: 'Сообщение отправленно',
    messages: 'Сообщения в данном чате',
  },
};
