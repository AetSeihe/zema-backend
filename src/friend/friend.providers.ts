import {
  FRIEND_REPOSITORY,
  REQUEST_REPOSITORY,
} from 'src/core/providers-names';
import { Friend } from './entity/friend.entity';
import { RequstFriend } from './entity/request.entity';

export const friendProviders = [
  {
    provide: FRIEND_REPOSITORY,
    useValue: Friend,
  },
  {
    provide: REQUEST_REPOSITORY,
    useValue: RequstFriend,
  },
];
