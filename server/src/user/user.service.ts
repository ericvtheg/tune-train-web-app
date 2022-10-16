import type { Opaque } from 'type-fest';
import { Injectable } from '@nestjs/common';
import { UserEntity, UserRepository } from "src/user/user.repository";

export type UserId = Opaque<string, "UserId">;
interface User {
  id: UserId;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isArtist: boolean;
}

/** Transforms db User entity to service layer User interface */
const transform = (entity: UserEntity): User => ({
  id: entity.id as UserId,
  username: entity.username,
  email: entity.email,
  password: entity.password,
  firstName: entity.first_name,
  lastName: entity.last_name,
  isArtist: false, //TODO add some conditional logic
});

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findUserById(id: UserId): Promise<User> {
    const user = await this.userRepository.findOneById(id)
    return user ? transform(user) : null;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneByEmail(email);
    return user ? transform(user) : null;
  }
  
  // createUser
}