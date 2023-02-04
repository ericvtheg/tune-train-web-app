import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';

export type UserEntity = User;

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async saveOne(user: Prisma.UserUncheckedCreateInput): Promise<UserEntity> {
    return await this.prisma.user.create({
      data: user,
    });
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return await this.prisma.user.findUnique({ where: { email } });
  }
}