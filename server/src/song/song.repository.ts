import { Song, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UserId } from 'src/user/user.service';

export type SongEntity = Song;

@Injectable()
export class SongRepository {
  constructor(private prisma: PrismaService) {}

  async saveOne(song: Prisma.SongUncheckedCreateInput): Promise<SongEntity> {
    return await this.prisma.song.create({
      data: song,
    });
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