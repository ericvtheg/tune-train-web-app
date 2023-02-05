import { Injectable } from '@nestjs/common';
import { Opaque } from 'type-fest';
import { UserId } from 'src/user/user.service';
import { SongId } from 'src/song/song.service';
import { QueueService } from 'src/common/services/queue/queue.service';
import { PrismaService } from 'nestjs-prisma';
import { Listen as ListenEntity } from '@prisma/client';

export type ListenId = Opaque<number, 'ListenId'>;
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
    private prisma: PrismaService,
    private queueService: QueueService,
  ) {}

  async produceListenMessage(body: ToBeCreatedListen): Promise<void> {
    return await this.queueService.sendMessage<ToBeCreatedListen>(body);
  }

  async createListen(listen: ToBeCreatedListen): Promise<Listen > {
    const listenEntity = await this.prisma.listen.upsert({
      where: {
        song_id_user_id: {
          song_id: listen.songId,
          user_id: listen.userId,
        },
      },
      create: {
        song_id: listen.songId,
        user_id: listen.userId,
        liked: listen.liked,
      },
      update: {
        liked: listen.liked,
      },
    });

    return transform(listenEntity);
  }
}