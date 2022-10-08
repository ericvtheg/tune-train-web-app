import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptService {
  private readonly saltRounds = 10;

  /** @warning MUST BE AWAITED */
  async hashPassword(password: string): Promise<string> {
    // TODO add await here
    return await bcrypt.hash(password, this.saltRounds);
  }

  /** @warning MUST BE AWAITED */
  async validatePassword(password: string, hash: string): Promise<boolean> {
    // TODO add await here
    return await bcrypt.compare(password, hash);
  }
}
