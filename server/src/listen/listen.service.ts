import { Injectable } from '@nestjs/common';
import { Opaque } from 'type-fest';
import { UserId } from 'src/user/user.service';
import { SongId } from 'src/song/song.service';
import { ListenRepository, ListenEntity } from 'src/listen/listen.repository';
import { QueueService } from 'src/common/services/queue/queue.service';

export type ListenId = Opaque<string, 'ListenId'>;
export type ToBeCreatedListen = Omit<Listen, 'id'>;

interface Listen {
  id: ListenId;
  songId: SongId;
  userId: UserId;
  liked: boolean;
}

const transform = (entity: ListenEntity): Listen => ({
  id: entity.id as ListenId,
  songId: entity.song_id as SongId,
  userId: entity.user_id as UserId,
  liked: entity.liked,
});

@Injectable()
export class ListenService {
  constructor(
    private listenRepository: ListenRepository,
    private queueService: QueueService,
  ) {}

  async produceListenMessage(body: ToBeCreatedListen): Promise<void> {
    return await this.queueService.sendMessage<ToBeCreatedListen>(body);
  }

  async createListen(listen: ToBeCreatedListen): Promise<Listen > {
    const listenEntityInput = {
      song_id: listen.songId,
      user_id: listen.userId,
      liked: listen.liked,
    };
    const listenEntity = await this.listenRepository.saveOne(listenEntityInput);
    return transform(listenEntity);
  }

  async findListenById(id: ListenId): Promise<Listen | null> {
    const listenEntity = await this.listenRepository.findOneById(id);
    return listenEntity ? transform(listenEntity) : null;
  }

  async findUserListens(userId: UserId): Promise<Listen[]> {
    const listenEntities = await this.listenRepository.findManyByUserId(userId);
    return listenEntities.map(listenEntity => transform(listenEntity));
  }

  async findSongListens(songId: SongId): Promise<Listen[]> {
    const listenEntities = await this.listenRepository.findManyBySongId(songId);
    return listenEntities.map(listenEntity => transform(listenEntity));
  }
}