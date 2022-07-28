import { Injectable, Inject } from '@nestjs/common';
import { UsersEntity } from '../users/entities/users.entity';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CryptService } from './crypt.service';

// TODO: use bcrypt to store hash or something for password
// TODO: refresh token if expired
// TODO: add other authentication strategies google, facebook, etc
// TODO: enable authentication on all(?) endpoints. and set few to public as necessary
// TODO: organize this directory. where should auth guard strategies live?

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(CryptService) private readonly cryptService: CryptService,
  ) {}
  // why do i not need to use injectable decorators here?

  async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<UsersEntity>> {
    const user = await this.usersService.findOneUsingEmail(email);
    if (user && this.cryptService.validatePassword(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UsersEntity) {
    // TODO: figure out why email isn't included in token
    const payload = {
      email: user.email,
      sub: user.id,
      id: user.id,
      isArtist: user.isArtist,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
