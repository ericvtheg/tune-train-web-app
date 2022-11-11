import { Injectable } from '@nestjs/common';
import { ArtistId } from 'src/artist/artist.service';
import { QueueService } from 'src/common/services/queue/queue.service';
import { ListenService } from 'src/listen/listen.service';
import { SongId } from 'src/song/song.service';
import { UserId } from 'src/user/user.service';

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

  // listen to queue (batch)
  // message typing is probably wrong here (sqs stuff)
  async consumeListenMessages(messages: ListenMessage[]): Promise<void> {
    // if error occurs, would like to throw message back on queue
    return await this.listenService.createListens(messages);
  }

  async produceListenMessage(message: ListenMessage): Promise<void> {
    return await this.queueService.sendMessage(message);
  }
}