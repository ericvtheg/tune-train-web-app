import { PrismaService } from 'nestjs-prisma';
import { UserId } from './users.service';
import { Injectable } from '@nestjs/common';

// I Dont like that I have two seperate User interfaces, how can I have prisma generate UserModel?

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findOneById(id: UserId){
    return await this.prisma.user.findUnique({ where: { id } })
  }
}