import { Injectable } from '@nestjs/common';
import { UsersEntity } from 'src/users/entities/users.entity';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

// TODO: use bcrypt to store hash or something for password
// TODO: refresh token if expired
// TODO: add other authentication strategies google, facebook, etc
// TODO: enable authentication on all(?) endpoints. and set few to public as necessary

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<UsersEntity>> {
    const user = await this.usersService.findOneUsingEmail(email);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UsersEntity) {
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
