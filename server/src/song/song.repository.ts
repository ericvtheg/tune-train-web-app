import { Song, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { SongId } from 'src/song/song.service';
import { UserId } from 'src/user/user.service';
import { ListenId } from 'src/listen/listen.service';
import { ArtistId } from 'src/artist/artist.service';

export type SongEntity = Song;

@Injectable()
export class SongRepository {
  constructor(private prisma: PrismaService) {}

  async saveOne(song: Prisma.SongUncheckedCreateInput): Promise<SongEntity> {
    return await this.prisma.song.create({
      data: song,
    });
  }

  async deleteOne(id: SongId): Promise<void> {
    await this.prisma.song.delete({ where: { id } });
  }

  async findOneById(id: SongId): Promise<SongEntity | null> {
    return await this.prisma.song.findUnique({ where: { id } });
  }

  async findOneByListenId(listenId: ListenId): Promise<SongEntity | null> {
    return await this.prisma.listen.findUnique({ where: { id: listenId } }).song();
  }

  async findManyByArtistId(artistId: ArtistId): Promise<SongEntity[]> {
    return await this.prisma.artist.findUnique({ where: { id: artistId } }).songs() ?? [];
  }

  async findOneWithNoListensFromUser(userId: UserId): Promise<SongEntity> {
    return (await this.prisma.$queryRaw<SongEntity[]>`
      SELECT *
      FROM song
      WHERE NOT EXISTS (
        SELECT listen.id 
        FROM listen 
        WHERE song.id = listen.song_id
        AND listen.user_id = ${userId}
      )
      ORDER BY random()
      LIMIT 1;
    `)?.[0];
  }
}