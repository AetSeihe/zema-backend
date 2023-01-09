import {
  CHAT_REPOSITORY,
  MESSAGE_FILE,
  MESSAGE_REPOSITORY,
  REPLY_MESSAGE,
} from 'src/core/providers-names';
import { Chat } from './entity/Chat.entity';
import { Message } from './entity/Message.entity';
import { MessageFile } from './entity/MessageFile.entity';
import { ReplyMessage } from './entity/ReplyMessage';

export const chatProviders = [
  {
    provide: MESSAGE_REPOSITORY,
    useValue: Message,
  },
  {
    provide: CHAT_REPOSITORY,
    useValue: Chat,
  },

  {
    provide: REPLY_MESSAGE,
    useValue: ReplyMessage,
  },
  {
    provide: MESSAGE_FILE,
    useValue: MessageFile,
  },
];
