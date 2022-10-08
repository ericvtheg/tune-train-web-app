import { PrismaService } from 'nestjs-prisma';
import { UserId } from "./users.service";

export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findUserById (id: UserId) {
    // this.prisma.user.findUnique({ where: { id } })
    return "";

  }
}