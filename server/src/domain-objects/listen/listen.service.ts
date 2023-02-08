import { Injectable } from '@nestjs/common';
import { Opaque } from 'type-fest';
import { UserId } from 'src/domain-objects/user/user.service';
import { SongId } from 'src/domain-objects/song/song.service';
import { PublishService } from 'src/services/publish/publish.service';
import { PrismaService } from 'nestjs-prisma';
import { Listen as ListenEntity } from '@prisma/client';

export type ListenId = Opaque<number, 'ListenId'>;

interface Listen {
  id: ListenId;
  songId: SongId;
  userId: UserId;
  liked: boolean;
}

export interface ToBeCreatedListen {
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
    private publishService: PublishService,
  ) {}

  async publishMessage(message: ToBeCreatedListen): Promise<void> {
    return await this.publishService.publishMessage(JSON.stringify(message));
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