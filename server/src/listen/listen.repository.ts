import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Listen, Prisma } from '@prisma/client';
import { UserId } from 'src/user/user.service';
import { SongId } from 'src/song/song.service';
import { ArtistId } from 'src/artist/artist.service';
import { ListenId } from 'src/listen/listen.service';

export type ListenEntity = Listen;

@Injectable()
export class ListenRepository {
  constructor(private prisma: PrismaService) {}

  /* eslint-disable camelcase */
  async saveMany(listens: Prisma.ListenCreateManyInput[]): Promise<void> {
    // TODO figure out how to best handle failed upserts here
    // would like to put just them back on queue
    const results = await Promise.allSettled(listens.map(
      listen => this.prisma.listen.upsert({
        where: {
          song_id_user_id: {
            song_id: listen.song_id,
            user_id: listen.user_id,
          },
        },
        create: listen,
        update: {
          liked: listen.liked,
        },
      }),
    ));
    const rejected = results.filter(result => result.status === 'rejected');
    if (rejected.length){
      console.log('rejected following listen upserts', rejected);
    }
  }

  async findOneById(id: ListenId): Promise<ListenEntity | null> {
    return await this.prisma.listen.findUnique({ where: { id } });
  }

  async findManyByUserId(userId: UserId): Promise<ListenEntity[]> {
    return await this.prisma.user.findUnique({ where: { id: userId } }).listens() ?? [];
  }

  async findManyBySongId(songId: SongId): Promise<ListenEntity[]> {
    return await this.prisma.song.findUnique({ where: { id: songId } }).listens() ?? [];
  }

  async findManyByArtistId(artistId: ArtistId): Promise<ListenEntity[]> {
    return await this.prisma.artist.findUnique({ where: { id: artistId } }).listens() ?? [];
  }
}