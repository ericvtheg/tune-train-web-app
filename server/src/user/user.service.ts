import type { Opaque } from 'type-fest';
import { UserRepository } from './user.repository';
import { Injectable } from '@nestjs/common';

export type UserId = Opaque<string>;
export interface User {
  id: UserId;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isArtist: boolean; // this field shouldn't live in the database, it should be determined on whether or not an artistId exists
}

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findUserById(id: UserId): Promise<User> {
    return (await this.userRepository.findOneById(id)) as any;
  }

  async findUserByEmail(email: string): Promise<User> {
    return (await this.userRepository.findOneByEmail(email)) as any;
  }
  
  // createUser
}