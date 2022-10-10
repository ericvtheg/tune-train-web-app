import type { Opaque } from 'type-fest';
import { UserRepository } from './user.repository';
import { Injectable } from '@nestjs/common';
import { UserEntity } from "src/user/user.repository";

export type UserId = Opaque<string>;
export interface User {
  id: UserId;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isArtist: boolean; // TODO this field shouldn't live in the database, it should be determined on whether or not an artistId exists
}

/** Transforms db User entity to service layer User interface */
const transform = (model: UserEntity): User => ({
  id: model.id as UserId,
  username: model.username,
  email: model.email,
  password: model.password,
  firstName: model.first_name,
  lastName: model.last_name,
  isArtist: false, //TODO add some conditional logic
});

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findUserById(id: UserId): Promise<User> {
    return transform(await this.userRepository.findOneById(id));
  }

  async findUserByEmail(email: string): Promise<User> {
    return transform(await this.userRepository.findOneByEmail(email));
  }
  
  // createUser
}