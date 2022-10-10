import { PrismaService } from 'nestjs-prisma';
import { UserId } from './user.service';
import { Injectable } from '@nestjs/common';
import { User as UserModel } from "@prisma/client";

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findOneById(id: UserId): Promise<UserModel> {
    return await this.prisma.user.findUnique({ where: { id } })
  }

  async findOneByEmail(email: string): Promise<UserModel> {
    return await this.prisma.user.findUnique({ where: { email } })
  }
}