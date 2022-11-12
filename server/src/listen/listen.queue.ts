import { Injectable, Inject } from '@nestjs/common';
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

  @SqsMessageHandler(process.env.LISTEN_QUEUE_NAME as string, true)
  async consumeListenMessages(messages: AWS.SQS.Message[]): Promise<void> {
    const listenMessages: ListenMessage[] = [];
    messages.forEach((message) => {
      if (message.Body){
        // try catch here? if fails throw back on queue with some retry logic thing
        const body: ListenMessage = JSON.parse(message.Body);
        listenMessages.push(body);
      }
    });
    // want to test that one bad body doesn't break everything here

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