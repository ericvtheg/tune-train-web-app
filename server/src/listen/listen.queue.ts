import { Injectable } from '@nestjs/common';
import { ArtistId } from 'src/artist/artist.service';
import { QueueService } from 'src/common/services/queue/queue.service';
import { ListenService } from 'src/listen/listen.service';
import { SongId } from 'src/song/song.service';
import { UserId } from 'src/user/user.service';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';

interface ListenMessage {
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

  @SqsMessageHandler(/** name: */ 'tune-train-listens-queue-sqs', /** batch: */ true)
  async consumeListenMessages(messages: AWS.SQS.Message[]): Promise<void> {
    const listenMessages: ListenMessage[] = [];
    messages.forEach((message) => {
      if (message.Body){
        const body: ListenMessage = JSON.parse(message.Body);
        listenMessages.push(body);
      }
    });

    return await this.listenService.createListens(listenMessages);
  }

  public onProcessingError(error: Error, message: AWS.SQS.Message) {
    console.log('hit in onProcessingError', error, message);
    // if error occurs, would like to throw message back on queue
    // report errors here
  }

  async produceListenMessage(message: ListenMessage): Promise<void> {
    return await this.queueService.sendMessage(message);
  }
}