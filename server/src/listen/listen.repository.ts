import { Injectable } from "@nestjs/common";
import { PrismaService } from 'nestjs-prisma';
import { Listen } from "@prisma/client";
import { UserId } from 'src/user/user.service';
import { SongId } from 'src/song/song.service';
import { ArtistId } from 'src/artist/artist.service';

export type ListenEntity = Listen;

@Injectable()
export class ListenRepository {
  constructor(private prisma: PrismaService) {}

  async findSongWithNoListen(userId: UserId): Promise<[SongId, ArtistId]> {
    return await this.prisma.$queryRaw<[SongId, ArtistId]>`
      SELECT song.id as songId, song.artist_id as artistId
      FROM song
      WHERE NOT EXISTS (
        SELECT listen.id 
        FROM listen 
        WHERE song.id = listen.song_id
        AND listen.user_id = ${userId}
      )
      ORDER BY random()
      LIMIT 1;
    `;
  }

  async findUserListens(userId: UserId): Promise<ListenEntity[]> {
    return await this.prisma.listen.findMany({
      where: {
        user_id: userId
      }
    });
  }

  async findSongListens(songId: SongId): Promise<ListenEntity[]> {
    return await this.prisma.listen.findMany({
      where: {
        song_id: songId
      }
    });
  } 
}