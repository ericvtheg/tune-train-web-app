import { Injectable } from '@nestjs/common';
import { QueueService } from 'src/common/services/queue/queue.service';


@Injectable()
export class ListenConsumer {
  constructor(
    private queueService: QueueService
  ) {}
}