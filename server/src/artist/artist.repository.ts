import { Artist, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UserId } from 'src/user/user.service';

export type ArtistEntity = Artist;

@Injectable()
export class ArtistRepository {
  constructor(private prisma: PrismaService) {}

  async saveOne(userId: UserId, artist: Prisma.ArtistUncheckedCreateInput): Promise<ArtistEntity> {
    return await this.prisma.artist.create({
      data: {
        id: userId,
        ...artist,
      },
    });
  }
}