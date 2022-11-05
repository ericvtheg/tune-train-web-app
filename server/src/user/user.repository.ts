import { PrismaService } from 'nestjs-prisma';
import { UserId } from 'src/user/user.service';
import { Injectable } from '@nestjs/common';
import { User } from "@prisma/client";
import { ListenId } from "src/listen/listen.service";

export type UserEntity = User;

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findOneById(id: UserId): Promise<UserEntity> {
    return await this.prisma.user.findUnique({ where: { id } })
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    return await this.prisma.user.findUnique({ where: { email } })
  }

  async findOneByListenId(listenId: ListenId): Promise<UserEntity> {
    return await this.prisma.listen.findUnique({ where: { id: listenId }}).user();
  }
}