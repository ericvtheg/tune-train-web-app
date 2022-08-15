import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  Inject,
} from '@nestjs/common';
import { CryptService } from '../../auth/crypt.service';

class AuthHashDTO {
  [k: string]: any;
  password: string;
}

/** Converts plain text password to hash using bcrypt */
@Injectable()
export class HashPipe
implements PipeTransform<AuthHashDTO, Promise<AuthHashDTO>> {
  constructor(@Inject(CryptService) private cryptService: CryptService) {}

  async transform(value: AuthHashDTO, metadata: ArgumentMetadata): Promise<AuthHashDTO> {
    const password = await this.cryptService.hashPassword(value.password);
    return { ...value, password };
  }
}
