import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import type { Opaque } from 'type-fest';

export type HashedPassword = Opaque<string, 'HashedPassword'>;

/** @description Used for hashing passwords */
@Injectable()
export class PasswordService {
  private readonly saltRounds = 10;

  async hashPassword(password: string): Promise<string> {
    return await hash(password, this.saltRounds);
  }

  async validatePassword(password: string, hashedPassword: HashedPassword): Promise<boolean> {
    return await compare(password, hashedPassword);
  }
}