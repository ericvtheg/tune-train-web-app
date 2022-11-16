import { Injectable, Logger } from '@nestjs/common';
import { ArtistId } from 'src/artist/artist.service';
import { QueueService } from 'src/common/services/queue/queue.service';
import { ListenService } from 'src/listen/listen.service';
import { SongId } from 'src/song/song.service';
import { UserId } from 'src/user/user.service';
import { SqsMessageHandler, SqsConsumerEventHandler } from '@ssut/nestjs-sqs';

interface ListenBody {
  songId: SongId;
  artistId: ArtistId;
  userId: UserId;
  liked: boolean;
}

@Injectable()
export class ListenQueue {
  constructor(
    private queueService: QueueService,
    private listenService: ListenService,
  ) {}

  async produceListenMessage(body: ListenBody): Promise<void> {
    return await this.queueService.sendMessage<ListenBody>(body);
  }

  @SqsMessageHandler(process.env.LISTEN_QUEUE_NAME as string, false)
  async consumeListenMessages(message: AWS.SQS.Message): Promise<void> {
    let listenBody: ListenBody;
    const body = message.Body;
    if (body) {
      try {
        listenBody = JSON.parse(body);
      } catch (error) {
        Logger.error('Failed to parse listen message body', JSON.stringify(message));
        throw error;
      }
    } else {
      const error = 'Undefined message body in listen queue';
      Logger.error(error);
      throw error;
    }

    await this.listenService.createListen(listenBody);
  }

  @SqsConsumerEventHandler(process.env.LISTEN_QUEUE_NAME as string, 'error')
  public onError(error: Error, message: AWS.SQS.Message): void {
    Logger.error('hit in onError', error, JSON.stringify(message));
  }

  @SqsConsumerEventHandler(process.env.LISTEN_QUEUE_NAME as string, 'processing_error')
  public onProcessingError(error: Error, message: AWS.SQS.Message): void {
    Logger.error('hit in onProcessingError', error, JSON.stringify(message));
  }

  @SqsConsumerEventHandler(process.env.LISTEN_QUEUE_NAME as string, 'timeout_error')
  public onTimeoutError(error: Error, message: AWS.SQS.Message): void {
    Logger.error('hit in onTimeoutError', error, JSON.stringify(message));
  }
}