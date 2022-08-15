import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CryptService } from './crypt.service';

// TODO: use bcrypt to store hash or something for password
// TODO: refresh token if expired
// TODO: add other authentication strategies google, facebook, etc
// TODO: enable authentication on all(?) endpoints. and set few to public as necessary
// TODO: organize this directory. where should auth guard strategies live?

export interface UserPayload {
  email: string;
  username: string;
  id: number;
  isArtist: boolean;
}

export interface IJWTResponse {
  accessToken: string;
}

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
  ): Promise<UserPayload> {
    try {
      const user = await this.usersService.findOneUsingEmail(email);
      if (user && true === await this.cryptService.validatePassword(password, user.password)) {
        const { password, ...result } = user;
        return result;
      }
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        throw error;
      }
    }
    return null;
  }

  async login(user: UserPayload): Promise<IJWTResponse> {
    return {
      accessToken: this.jwtService.sign(user),
    };
  }
}
