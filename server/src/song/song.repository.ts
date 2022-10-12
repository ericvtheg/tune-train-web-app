import { Song } from "@prisma/client";
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { SongId } from "src/song/song.service"

export type SongEntity = Song;

@Injectable()
export class SongRepository {
  constructor(private prisma: PrismaService) {}
  
  async findOneById(id: SongId): Promise<SongEntity> {
    return await this.prisma.song.findUnique({ where: { id } })
  }
}