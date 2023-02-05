import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
} from '@nestjs/common';
import { PasswordService } from 'src/auth/password.service';

interface InputBody {
  [k: string]: any;
  password?: string;
}

interface OutputBody {
  [k: string]: any;
  password: string | undefined;
}

/** @description Converts plain text password to hash */
@Injectable()
export class HashPipe implements PipeTransform {
  constructor(private readonly passwordService: PasswordService) {}

  async transform(data: InputBody, metadata: ArgumentMetadata): Promise<OutputBody> {
    const password = data.password;
    if (password !== undefined){
      const hashedPassword = await this.passwordService.hashPassword(password);
      return { ...data, password: hashedPassword };
    }
    return { ...data, password: undefined };
  }
}