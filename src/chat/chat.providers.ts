import {
  CHAT_REPOSITORY,
  MESSAGE_AND_PINED_REPOSITORY,
  MESSAGE_FILES_REPOSITORY,
  MESSAGE_PINED_REPOSITORY,
  MESSAGE_REPOSITORY,
} from 'src/core/providers-names';
import { Chat } from './entity/Chat.entity';
import { Message } from './entity/Message.entity';
import { MessageAndPintedMessage } from './entity/MessageAndPintedMessage';
import { MessageFiles } from './entity/MessageFiles.entity';
import { PinnedMessages } from './entity/PinnedMessages.entity';

export const userProviders = [
  {
    provide: CHAT_REPOSITORY,
    useValue: Chat,
  },

  {
    provide: MESSAGE_REPOSITORY,
    useValue: Message,
  },
  {
    provide: MESSAGE_FILES_REPOSITORY,
    useValue: MessageFiles,
  },
  {
    provide: MESSAGE_PINED_REPOSITORY,
    useValue: PinnedMessages,
  },
  {
    provide: MESSAGE_AND_PINED_REPOSITORY,
    useValue: MessageAndPintedMessage,
  },
];
