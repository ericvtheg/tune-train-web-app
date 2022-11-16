import { PrismaService } from 'nestjs-prisma';
import { UserId } from 'src/user/user.service';
import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { ListenId } from 'src/listen/listen.service';

export type UserEntity = User;

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async saveOne(user: Prisma.UserUncheckedCreateInput): Promise<UserEntity> {
    return await this.prisma.user.create({
      data: user,
    });
  }

  async updateOne(id: UserId, data: Prisma.UserUncheckedUpdateInput): Promise<UserEntity> {
    return await this.prisma.user.update({
      data,
      where: {
        id,
      },
    });
  }

  async findOneById(id: UserId): Promise<UserEntity | null> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findOneByListenId(listenId: ListenId): Promise<UserEntity | null> {
    return await this.prisma.listen.findUnique({ where: { id: listenId } }).user();
  }
}