import { PrismaService } from 'nestjs-prisma';
import type { Opaque } from 'type-fest';
import { Injectable } from '@nestjs/common';
import { User as UserEntity, Artist as ArtistEntity } from '@prisma/client';
import { ToBeCreatedArtist, Artist, transform as artistTransform } from 'src/domain-objects/artist/artist.service';

export type UserId = Opaque<number, 'UserId'>;

export interface User {
  id: UserId;
  username: string;
  email: string;
  password: string;
  firstName: string;
  artist: Artist | null;
}

interface ToBeCreatedUser {
  username: string;
  email: string;
  firstName: string;
  password: string;
  artist?: ToBeCreatedArtist;
}

type UserAndArtistEntity = UserEntity & { artist: ArtistEntity | null};

const transform = (entity: UserAndArtistEntity): User => ({
  id: entity.id as UserId,
  username: entity.username,
  email: entity.email,
  password: entity.password,
  firstName: entity.first_name,
  artist: entity.artist ? artistTransform(entity.artist) : null,
});

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(user: ToBeCreatedUser): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        username: user.username,
        email: user.email,
        password: user.password,
        first_name: user.firstName,
        artist: user?.artist ? {
          create: {
            stage_name: user.artist.stageName,
            bio: user.artist.bio,
          },
        } : undefined,
      },
      include: {
        artist: true,
      },
    });

    return transform(createdUser);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const userEntity = await this.prisma.user.findUnique({
      where: { email },
      include: { artist: true },
    });
    return userEntity ? transform(userEntity) : null;
  }
}