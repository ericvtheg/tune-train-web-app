import type { Opaque } from 'type-fest';
import { UsersRepository } from './users.repository';
import { Injectable } from '@nestjs/common';

export type UserId = Opaque<string>;
export interface User {
  id: UserId;
  username: string;
  avatar: string;
  isArtist: boolean; // this field shouldn't live in the database, it should be determined on whether or not an artistId exists
}

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async findUserById(id: UserId): Promise<User> {
    return (await this.usersRepository.findOneById(id)) as any;
  }
}