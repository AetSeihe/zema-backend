import { MessageDTO } from './message.dto';

export class AllMessagessDTO {
  constructor(partial: Partial<AllMessagessDTO>) {
    Object.assign(this, partial);
  }
  messages: MessageDTO[];
}
