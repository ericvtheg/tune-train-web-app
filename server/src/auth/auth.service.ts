import { Injectable } from '@nestjs/common';
import { PasswordService, HashedPassword } from 'src/auth/password.service';
import { User, UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    private readonly jwtTokenService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly userService: UserService,
  ) {}

  private async validatePassword(inputPassword: string, hashedPassword: HashedPassword): Promise<boolean> {
    return await this.passwordService.validatePassword(inputPassword, hashedPassword);
  }

  async validateUser(email: string, password: string ): Promise<User | null> {
    const user = await this.userService.findUserByEmail(email);
    if (user) {
      const isValidPassword = await this.validatePassword(password, user.password as HashedPassword);
      if (isValidPassword) {
        return user;
      }
    }
    return null;
  }

  async generateUserCredentials(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      id: user.id,
    };
    return this.jwtTokenService.sign(payload);
  }
}