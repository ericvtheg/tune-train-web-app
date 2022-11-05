import { Artist } from "@prisma/client";
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ArtistId } from 'src/artist/artist.service';
import { SongId } from "src/song/song.service";

export type ArtistEntity = Artist;

@Injectable()
export class ArtistRepository {
  constructor(private prisma: PrismaService) {}

  async findOneById(id: ArtistId): Promise<ArtistEntity> {
    return await this.prisma.artist.findUnique({ where: { id } })
  }

  async findOneBySongId(songId: SongId): Promise<ArtistEntity> {
    return await this.prisma.song.findUnique({ where: { id: songId} } ).artist();
  }
}