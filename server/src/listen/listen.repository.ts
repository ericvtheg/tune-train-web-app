import { Injectable } from "@nestjs/common";
import { PrismaService } from 'nestjs-prisma';
import { Listen } from "@prisma/client";
import { UserId } from 'src/user/user.service';
import { SongId } from 'src/song/song.service';
import { ArtistId } from 'src/artist/artist.service';
import { ListenId } from 'src/listen/listen.service';

export type ListenEntity = Listen;

@Injectable()
export class ListenRepository {
  constructor(private prisma: PrismaService) {}

  async findOneById(id: ListenId): Promise<ListenEntity> {
    return await this.prisma.listen.findUnique({
      where: { id }
    });
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

  // findArtistListens(artistId: ArtistId)
}