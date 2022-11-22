import type { Opaque } from 'type-fest';
import { Injectable } from '@nestjs/common';
import { UserEntity, UserRepository } from 'src/user/user.repository';
import { ListenId } from 'src/listen/listen.service';
import { ArtistId } from 'src/artist/artist.service';

export type UserId = Opaque<string, 'UserId'>;
type ToBeCreatedUser = Omit<User, 'id'>;
type UpdateUser = Partial<Omit<User, 'id' | 'email'>>;

export interface User {
  id: UserId;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string | null;
}

const transform = (entity: UserEntity): User => ({
  id: entity.id as UserId,
  username: entity.username,
  email: entity.email,
  password: entity.password,
  firstName: entity.first_name,
  lastName: entity.last_name,
});

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(user: ToBeCreatedUser): Promise<User> {
    const userEntityInput = {
      username: user.username,
      email: user.email,
      password: user.password,
      first_name: user.firstName,
      last_name: user.lastName,
    };
    const userEntity = await this.userRepository.saveOne(userEntityInput);
    return transform(userEntity);
  }

  async updateUser(id: UserId, partialUser: UpdateUser): Promise<User> {
    const userEntityUpdateInput = {
      username: partialUser.username,
      password: partialUser.password,
      first_name: partialUser.firstName,
      last_name: partialUser.lastName,
    };
    const userEntity = await this.userRepository.updateOne(id, userEntityUpdateInput);
    return transform(userEntity);
  }

  async findUserById(id: UserId): Promise<User | null> {
    const userEntity = await this.userRepository.findOneById(id);
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

  async findUserByArtistId(artistId: ArtistId): Promise<User | null> {
    const userEntity = await this.userRepository.findOneByArtistId(artistId);
    return userEntity ? transform(userEntity) : null;
  }
}