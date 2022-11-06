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

  // async saveMany(listens: )

  async findOneById(id: ListenId): Promise<ListenEntity | null> {
    return await this.prisma.listen.findUnique({ where: { id }});
  }

  async findManyByUserId(userId: UserId): Promise<ListenEntity[]> {
    return await this.prisma.user.findUnique({ where: { id: userId }}).listens() ?? [];
  }

  async findManyBySongId(songId: SongId): Promise<ListenEntity[]> {
    return await this.prisma.song.findUnique({ where: { id: songId }}).listens() ?? [];
  } 

  async findManyByArtistId(artistId: ArtistId): Promise<ListenEntity[]> {
    return await this.prisma.artist.findUnique({ where: { id: artistId }}).listens() ?? [];
  }
}