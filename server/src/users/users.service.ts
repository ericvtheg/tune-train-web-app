import type { Opaque } from 'type-fest';

export type UserId = Opaque<string>;
export interface User {
  id: UserId;
  username: string;
  avatar: string;
  isArtist: boolean; // this field shouldn't live in the database, it should be determined on whether or not an artistId exists
}

export class UsersService {
  async findOneById(id: UserId): Promise<User> {
    return {} as any;
  }
}