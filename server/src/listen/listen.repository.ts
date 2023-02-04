import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Listen, Prisma } from '@prisma/client';

export type ListenEntity = Listen;

@Injectable()
export class ListenRepository {
  constructor(private prisma: PrismaService) {}

  async saveOne(listen: Prisma.ListenUncheckedCreateInput): Promise<ListenEntity> {
    return await this.prisma.listen.upsert({
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
    });
  }
}