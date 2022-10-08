import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CryptService } from './crypt.service';

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
    private readonly usersService: any,
    private readonly jwtService: JwtService,
    @Inject(CryptService) private readonly cryptService: CryptService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserPayload> {
    try {
      console.log("hit in validate user");
      const user = await this.usersService.findOneUsingEmail(email);
      console.log(user, "user");
      if (user && await this.cryptService.validatePassword(password, user.password) === true) {
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
