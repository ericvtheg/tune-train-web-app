import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { PasswordService } from 'src/auth/password.service';

/** @description Converts plain text password to hash */
@Injectable()
export class PasswordHashPipe implements PipeTransform {
  constructor(private readonly passwordService: PasswordService) {}

  async transform(data: unknown, metadata: ArgumentMetadata): Promise<any> {
    if (typeof data === 'object' && data !== null) {
      if ('password' in data) {
        const password = (data as { password: string }).password;
        if (password) {
          const hashedPassword = await this.passwordService.hashPassword(
            password
          );
          return { ...data, password: hashedPassword };
        }
      }
    }
    return data;
  }
}
