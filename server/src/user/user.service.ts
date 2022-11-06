import type { Opaque } from 'type-fest';
import { Injectable } from '@nestjs/common';
import { UserEntity, UserRepository } from "src/user/user.repository";
import { ListenId } from "src/listen/listen.service";

export type UserId = Opaque<string, "UserId">;
interface User {
  id: UserId;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string | null;
  isArtist: boolean;
}

const transform = (entity: UserEntity): User => ({
  id: entity.id as UserId,
  username: entity.username,
  email: entity.email,
  password: entity.password,
  firstName: entity.first_name,
  lastName: entity.last_name,
  isArtist: entity.is_artist,
});

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findUserById(id: UserId): Promise<User | null> {
    const userEntity = await this.userRepository.findOneById(id)
    return userEntity ? transform(userEntity) : null;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOneByEmail(email);
    return userEntity ? transform(userEntity) : null;
  }

  async findUserByListenId(listenId: ListenId): Promise<User | null> {
    const userEntity = await this.userRepository.findOneByListenId(listenId);
    return userEntity ? transform(userEntity) : null;
  }
  
  // createUser
}