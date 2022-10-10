import { PrismaService } from 'nestjs-prisma';
import { UserId } from './user.service';
import { Injectable } from '@nestjs/common';

// I Dont like that I have two seperate User interfaces, how can I have prisma generate UserModel?

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findOneById(id: UserId){
    return await this.prisma.user.findUnique({ where: { id } })
  }

  async findOneByEmail(email: string){
    return await this.prisma.user.findUnique({ where: { email } })
  }
}