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

  async findSongWithNoListen(id: UserId): Promise<[SongId, ArtistId]> {
    return await this.prisma.$queryRaw<[SongId, ArtistId]>`
      SELECT song.id as songId, song.artist_id as artistId
      FROM song
      WHERE NOT EXISTS (
        SELECT listen.id 
        FROM listen 
        WHERE song.id = listen.song_id
        AND listen.user_id = ${id}
      )
      ORDER BY random()
      LIMIT 1;
    `;
  }
}