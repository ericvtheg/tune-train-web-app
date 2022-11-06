import { Injectable } from '@nestjs/common';
import { QueueService } from 'src/common/services/queue/queue.service';


@Injectable()
export class ListenConsumer {
  constructor(
    private queueService: QueueService
  ) {}

  // listen to queue 
  async consumeListen() {
    // save listen(s) using listen service
  }
}