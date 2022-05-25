import {
  CHAT_REPOSITORY,
  CHAT_USER_REPOSITORY,
  MESSAGE_FILE_REPOSITORY,
  MESSAGE_PINTED_REPOSITORY,
  MESSAGE_REPOSITORY,
} from 'src/core/providers-names';
import { Chat } from './entity/Chat.entity';
import { ChatUser } from './entity/ChatUser.enity';
import { Message } from './entity/Message';
import { MessageFile } from './entity/MessageFile';
import { PinnedMessage } from './entity/PinnedMessage.enity';

export const postProviders = [
  {
    provide: CHAT_REPOSITORY,
    useValue: Chat,
  },
  {
    provide: MESSAGE_PINTED_REPOSITORY,
    useValue: PinnedMessage,
  },
  {
    provide: MESSAGE_FILE_REPOSITORY,
    useValue: MessageFile,
  },
  {
    provide: CHAT_USER_REPOSITORY,
    useValue: ChatUser,
  },
  {
    provide: MESSAGE_REPOSITORY,
    useValue: Message,
  },
];
